import express from 'express';
import {
  previewAllCourses,
  previewSingleCourse,
  uploadCourse,
} from '../controllers/course.controller';
import { authorizeRoles, isAuthenticated } from '../middleware/auth';
const courseRouter = express.Router();

courseRouter.get('/courses/:id', previewSingleCourse);
courseRouter.get('/courses', previewAllCourses);

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
