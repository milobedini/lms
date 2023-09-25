import cloudinary from 'cloudinary';
import { config } from 'dotenv';
import ejs from 'ejs';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import path from 'path';
import { CatchAsyncError } from '../middleware/catchAsyncError';
import userModel, { IUser } from '../models/user.model';
import { getAllUsersService, getUserById } from '../services/user.service';
import ErrorHandler from '../utils/ErrorHandler';
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from '../utils/jwt';
import { redis } from '../utils/redis';
import sendMail from '../utils/sendMail';

config();

// register user
type IRegistrationBody = {
  name: string;
  email: string;
  password: string;
  avatar?: string;
};

export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler('Email already exist', 400));
      }

      const user: IRegistrationBody = {
        name,
        email,
        password,
      };

      const activationToken = createActivationToken(user);

      const activationCode = activationToken.activationCode;

      const data = { user: { name: user.name }, activationCode };
      await ejs.renderFile(
        path.join(__dirname, '../mails/activation-mail.ejs'),
        data,
      );

      try {
        await sendMail({
          email: user.email,
          subject: 'Activate your account',
          template: 'activation-mail.ejs',
          data,
        });

        res.status(201).json({
          success: true,
          message: `Please check your email: ${user.email} to activate your account!`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

type IActivationToken = {
  token: string;
  activationCode: string;
};

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: '5m',
    },
  );

  return { token, activationCode };
};

// CONFIRM USER
type IActivationRequest = {
  activation_token: string;
  activation_code: string;
};

export const confirmUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;

      // Check that the new user is valid
      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string,
      ) as { user: IUser; activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler('Invalid activation code', 400));
      }

      const { name, email, password } = newUser.user;

      // Check if exists
      const userExists = await userModel.findOne({ email });

      if (userExists) {
        return next(new ErrorHandler('User already exists', 400));
      }

      const user = await userModel.create({
        name,
        email,
        password,
      });

      res.send(201).json({
        success: true,
        message: `${user.name}, Your account has been created successfully`,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

// LOGIN USER

type ILoginBody = {
  email: string;
  password: string;
};

export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginBody;
      if (!email || !password) {
        return next(
          new ErrorHandler('Please enter your email and password', 400),
        );
      }

      const user = await userModel.findOne({ email }).select('+password');
      if (!user) {
        return next(new ErrorHandler('Invalid email or password', 400));
      }

      const isPasswordMatched = await user.comparePassword(password);
      if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid email or password', 400));
      }

      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

export const logoutUser = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      // Empty cookies
      res.cookie('access_token', '', { maxAge: 1 });
      res.cookie('refresh_token', '', { maxAge: 1 });

      // Delete from cache
      const userId = req.user._id || '';
      redis.del(userId);

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

// Update access token
export const updateAccessToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;
      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string,
      ) as JwtPayload;

      const message = 'Could not refresh token';
      if (!decoded) {
        return next(new ErrorHandler(message, 400));
      }
      // Generate new access token using refresh token
      const session = (await redis.get(decoded.id)) as string;

      if (!session) {
        return next(new ErrorHandler(message, 400));
      }

      const user = JSON.parse(session);

      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        {
          expiresIn: '10m',
        },
      );

      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as string,
        {
          expiresIn: '30d',
        },
      );

      req.user = user;

      // Update cookies
      res.cookie('access_token', accessToken, accessTokenOptions);
      res.cookie('refresh_token', refreshToken, refreshTokenOptions);

      res.status(200).json({
        success: true,
        accessToken,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

// Get User by ID
export const getUserInfo = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const userId = req.user._id;
      getUserById(userId, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

type ISocialAuthBody = {
  name: string;
  email: string;
  avatar: string;
};

// Social Authentication
export const socialLogin = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, avatar } = req.body as ISocialAuthBody;
      const user = await userModel.findOne({ email });
      if (!user) {
        const newUser = await userModel.create({
          name,
          email,
          avatar,
        });

        sendToken(newUser, 200, res);
      } else {
        // If already exists, just send the token
        sendToken(user, 200, res);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

// UPDATE USER INFO

type IUpdateUserBody = {
  name?: string;
  email?: string;
};

export const updateUserInfo = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { name, email } = req.body as IUpdateUserBody;
      const userId = req.user._id;
      const user = await userModel.findById(userId);

      if (email && user) {
        const isEmailExist = await userModel.findOne({ email });
        if (isEmailExist) {
          return next(new ErrorHandler('Email already exist', 400));
        }
        user.email = email;
      }

      if (name && user) {
        user.name = name;
      }

      await user?.save();

      await redis.set(userId, JSON.stringify(user));

      res.status(201).json({
        success: true,
        message: 'User updated successfully',
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

// UPDATE USER PASSWORD
type IUpdatePasswordBody = {
  currentPassword: string;
  newPassword: string;
};

export const updateUserPassword = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { currentPassword, newPassword } = req.body as IUpdatePasswordBody;
      const userId = req.user._id;
      const user = await userModel.findById(userId).select('+password');

      if (!user) {
        return next(new ErrorHandler('User not found', 400));
      }

      if (!currentPassword || !newPassword) {
        return next(new ErrorHandler('Please enter old and new password', 400));
      }

      const isPasswordMatched = await user.comparePassword(currentPassword);
      if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid current password', 400));
      }

      user.password = newPassword;
      await user.save();
      await redis.set(req.user._id, JSON.stringify(user));

      res.status(201).json({
        success: true,
        message: 'Password updated successfully',
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

// UPDATE USER AVATAR

type IUpdateAvatarBody = {
  avatar: string;
};

export const updateUserAvatar = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body as IUpdateAvatarBody;

      const userId = req?.user?._id;

      const user = await userModel.findById(userId);

      if (avatar && user) {
        if (user?.avatar?.public_id) {
          // Delete old image if there us one
          await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);
          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: 'skillscape/avatars',
            width: 150,
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        } else {
          // Just upload new image
          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: 'skillscape/avatars',
            width: 150,
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        }
      }

      await user?.save();
      await redis.set(userId, JSON.stringify(user));

      res.status(201).json({
        success: true,
        message: 'Avatar updated successfully',
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

// GET all users, admin only.
export const getAllUsers = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllUsersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);
