import cloudinary from 'cloudinary';
import ejs from 'ejs';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { CatchAsyncError } from '../middleware/catchAsyncError';
import CourseModel from '../models/course.model';
import NotificationModel from '../models/notification.model';
import { createCourse } from '../services/course.service';
import ErrorHandler from '../utils/ErrorHandler';
import { redis } from '../utils/redis';
import sendMail from '../utils/sendMail';

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

// Add question to course
type IAddQuestionBody = {
  question: string;
  courseId: string;
  contentId: string;
};

export const addQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId }: IAddQuestionBody = req.body;
      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler('Invalid Content ID', 400));
      }

      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId),
      );

      if (!courseContent) {
        return next(new ErrorHandler('Invalid Content ID', 400));
      }

      //   Create new question object.

      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };

      // Add to course content
      courseContent.questions.push(newQuestion);

      await NotificationModel.create({
        user: req.user?._id,
        title: 'New Question Received',
        message: `You have a new question in Course ${course?.name}, on ${courseContent.title} from ${req.user?.name}}`,
      });

      await course?.save();
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

type IAddReplyBody = {
  reply: string;
  courseId: string;
  contentId: string;
  questionId: string;
};

// Add reply to question
export const addReply = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { reply, courseId, contentId, questionId }: IAddReplyBody =
        req.body;

      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler('Invalid Content ID', 400));
      }

      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId),
      );

      if (!courseContent) {
        return next(new ErrorHandler('Invalid Content ID', 400));
      }

      const question = courseContent?.questions?.find((item: any) =>
        item._id.equals(questionId),
      );

      if (!question) {
        return next(new ErrorHandler('Invalid Question ID', 400));
      }

      //   Create new reply object.

      const newReply: any = {
        user: req.user,
        reply,
      };

      // Add to course content
      question.questionReplies?.push(newReply);

      await course?.save();

      if (req.user?._id === question.user._id) {
        await NotificationModel.create({
          user: req.user?._id,
          title: 'New Question Reply Received',
          message: `You have a new question reply in Course ${course?.name}, on ${courseContent.title} from ${req.user?.name}}`,
        });
      } else {
        // Send email to user.
        const data = {
          name: question.user.name,
          title: courseContent.title,
        };

        await ejs.renderFile(
          path.join(__dirname, '../mails/question-reply.ejs'),
          data,
        );

        try {
          await sendMail({
            email: question.user.email,
            subject: 'Question Reply on Skillscape',
            template: 'question-reply.ejs',
            data,
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 500));
        }
      }

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// Add review to course
type IAddReviewBody = {
  review: string;
  rating: number;
  userId: string;
};

export const addReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;

      const coursePurchased = userCourseList?.some(
        (course: any) => course._id.toString() === courseId,
      );

      if (!coursePurchased) {
        return next(
          new ErrorHandler('You have not purchased this course', 400),
        );
      }

      const course = await CourseModel.findById(courseId);

      const { rating, review }: IAddReviewBody = req.body;

      const reviewData: any = {
        user: req.user,
        rating,
        comment: review,
      };

      course?.reviews.push(reviewData);

      let avgRating = 0;
      course?.reviews?.forEach((review: any) => {
        avgRating += review.rating;
      });
      if (course) {
        course.ratings = avgRating / course?.reviews?.length;
      }

      await course?.save();

      const notifcation = {
        title: 'New review on your course',
        message: `${req.user?.name} has reviewed your course ${course?.name}`,
      };

      //   Create notification for course creator.

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// Admin reply to review

type IAddReplyToReviewBody = {
  comment: string;
  courseId: string;
  reviewId: string;
};

export const addReplyToReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, courseId, reviewId } = req.body as IAddReplyToReviewBody;

      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler('Invalid Course ID', 400));
      }

      const review = course?.reviews?.find(
        (item: any) => item._id.toString() === reviewId,
      );

      if (!review) {
        return next(new ErrorHandler('Invalid Review ID', 400));
      }

      const replyData: any = {
        user: req.user,
        comment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (!review.commentReplies) {
        review.commentReplies = [];
      }

      review.commentReplies?.push(replyData);

      await course.save();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);
