import { NextFunction, Request, Response } from 'express';
import { CatchAsyncError } from '../middleware/catchAsyncError';
import CourseModel from '../models/course.model';
import OrderModel from '../models/order.model';
import userModel from '../models/user.model';
import ErrorHandler from '../utils/ErrorHandler';
import { generateLast12MonthsData } from '../utils/analytics.generator';

export const getLast12MonthsUserAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await generateLast12MonthsData(userModel);

      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

export const getLast12MonthsCoursesAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await generateLast12MonthsData(CourseModel as any);

      res.status(200).json({
        success: true,
        data: courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);
export const getLast12MonthsOrdersAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await generateLast12MonthsData(OrderModel as any);

      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);
