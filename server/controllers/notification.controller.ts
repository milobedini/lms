import { NextFunction, Request, Response } from 'express';
import cron from 'node-cron';
import { CatchAsyncError } from '../middleware/catchAsyncError';
import NotificationModel from '../models/notification.model';
import ErrorHandler from '../utils/ErrorHandler';

// GET all notifications, admin only.
export const getNotifications = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notifications = await NotificationModel.find().sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        notifications,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// UPDATE notification status, admin only.
export const updateNotification = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notification = await NotificationModel.findByIdAndUpdate(
        req.params.id,
      );
      if (!notification) {
        return next(new ErrorHandler('Notification not found', 404));
      }
      notification.status
        ? (notification.status = 'read')
        : notification.status;

      await notification.save();

      const notifications = await NotificationModel.find().sort({
        createdAt: -1,
      });

      res.status(201).json({
        success: true,
        notifications,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// DELETE notification, admin only.
// Crone job to delete notifications older than 30 days.

// Second, minute, hour, day of month, month, day of week
cron.schedule('0 0 0 * * *', async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await NotificationModel.deleteMany({
    status: 'read',
    // Only delete those older than 30 days and those that are read.
    createdAt: { $lt: thirtyDaysAgo },
  });
});
