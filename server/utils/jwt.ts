import { config } from 'dotenv';
import { Response } from 'express';
import { IUser } from '../models/user.model';
import { redis } from './redis';
config();

type ITokenOptions = {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: 'lax' | 'strict' | 'none' | undefined;
  secure?: boolean;
};

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.signAccessToken();
  const refreshToken = user.signRefreshToken();

  //   Upload session to Redis
  redis.set(user._id, JSON.stringify(user) as any);

  // Parse env variables to integrate with fallback values
  const accessTokenExpire = parseInt(
    process.env.ACCESS_TOKEN_EXPIRY || '300',
    10,
  );
  const refreshTokenExpire = parseInt(
    process.env.REFRESH_TOKEN_EXPIRY || '1200',
    10,
  );

  //   Cookie options
  const accessTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 1000),
    maxAge: accessTokenExpire * 1000,
    httpOnly: true,
    sameSite: 'lax',
  };

  const refreshTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 1000),
    maxAge: refreshTokenExpire * 1000,
    httpOnly: true,
    sameSite: 'lax',
  };

  //   Set secure in production
  if (process.env.NODE_ENV === 'production') {
    accessTokenOptions.secure = true;
  }

  res.cookie('access_token', accessToken, accessTokenOptions);
  res.cookie('refresh_token', refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
