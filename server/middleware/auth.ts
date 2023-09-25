import { NextFunction, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ErrorHandler from '../utils/ErrorHandler';
import { redis } from '../utils/redis';
import { CatchAsyncError } from './catchAsyncError';

export const isAuthenticated = CatchAsyncError(
  async (req: any, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;

    if (!access_token) {
      return next(new ErrorHandler('User is not authenticated', 401));
    }

    const decoded = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN as string,
    ) as JwtPayload;

    if (!decoded) {
      return next(new ErrorHandler('Access token invalid', 401));
    }

    const user = await redis.get(decoded.id);

    if (!user) {
      return next(
        new ErrorHandler('Please login to access this resource', 404),
      );
    }

    req.user = JSON.parse(user);
    next();
  },
);

// Validate user role for specific routes
export const authorizeRoles = (...roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || '')) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to access this resource`,
          403,
        ),
      );
    }
    next();
  };
};
