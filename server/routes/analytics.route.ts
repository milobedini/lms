import express from 'express';
import {
  getLast12MonthsCoursesAnalytics,
  getLast12MonthsOrdersAnalytics,
  getLast12MonthsUserAnalytics,
} from '../controllers/analytics.controller';
import { authorizeRoles, isAuthenticated } from '../middleware/auth';

const analyticsRouter = express.Router();

analyticsRouter.get(
  '/users-analytics',
  isAuthenticated,
  authorizeRoles('admin'),
  getLast12MonthsUserAnalytics,
);
analyticsRouter.get(
  '/courses-analytics',
  isAuthenticated,
  authorizeRoles('admin'),
  getLast12MonthsCoursesAnalytics,
);
analyticsRouter.get(
  '/orders-analytics',
  isAuthenticated,
  authorizeRoles('admin'),
  getLast12MonthsOrdersAnalytics,
);

export default analyticsRouter;
