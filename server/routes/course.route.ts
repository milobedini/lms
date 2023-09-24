import express from 'express';
import {
  addQuestion,
  addReply,
  addReplyToReview,
  addReview,
  getCourse,
  previewAllCourses,
  previewSingleCourse,
  uploadCourse,
} from '../controllers/course.controller';
import { authorizeRoles, isAuthenticated } from '../middleware/auth';
const courseRouter = express.Router();

courseRouter.get('/courses/:id', previewSingleCourse);
courseRouter.get('/courses', previewAllCourses);

courseRouter.get('/course-content/:id', isAuthenticated, getCourse);

courseRouter.put('/add-question', isAuthenticated, addQuestion);
courseRouter.put('/add-reply', isAuthenticated, addReply);
courseRouter.put('/add-review/:id', isAuthenticated, addReview);
courseRouter.put(
  '/add-review-reply',
  isAuthenticated,
  authorizeRoles('admin'),
  addReplyToReview,
);

courseRouter.post(
  '/create-course',
  isAuthenticated,
  authorizeRoles('admin'),
  uploadCourse,
);
courseRouter.put(
  '/edit-course/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  uploadCourse,
);

export default courseRouter;
