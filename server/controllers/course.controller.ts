import cloudinary from 'cloudinary';
import { NextFunction, Request, Response } from 'express';
import { CatchAsyncError } from '../middleware/catchAsyncError';
import CourseModel from '../models/course.model';
import { createCourse } from '../services/course.service';
import ErrorHandler from '../utils/ErrorHandler';
import { redis } from '../utils/redis';

// Upload Course
export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: 'skillscape/courses',
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      createCourse(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

export const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        await cloudinary.v2.uploader.destroy(thumbnail.public_id);
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: 'skillscape/courses',
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      const courseId = req.params.id;

      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        {
          $set: data,
        },
        { new: true },
      );

      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// Get Single Course, without purchasing.

export const previewSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;

      const isCached = await redis.get(courseId);

      if (isCached) {
        const course = JSON.parse(isCached);
        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModel.findById(courseId).select(
          '-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links',
        );

        await redis.set(courseId, JSON.stringify(course));

        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

export const previewAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isCached = await redis.get('courses');

      if (isCached) {
        const courses = JSON.parse(isCached);
        res.status(200).json({
          success: true,
          courses,
        });
      } else {
        const courses = await CourseModel.find().select(
          '-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links',
        );
        await redis.set('courses', JSON.stringify(courses));
        res.status(200).json({
          success: true,
          courses,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// GET COURSE AFTER PURCHASE
export const getCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;
      const coursePurchased = userCourseList?.find(
        (course: any) => course._id.toString() === courseId,
      );

      if (!coursePurchased) {
        return next(
          new ErrorHandler('You have not purchased this course', 400),
        );
      }

      const course = await CourseModel.findById(courseId);

      const content = course?.courseData;

      res.status(200).json({
        success: true,
        content,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);
