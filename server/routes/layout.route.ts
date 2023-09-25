import express from 'express';
import { createLayout } from '../controllers/layout.controller';
import { authorizeRoles, isAuthenticated } from '../middleware/auth';

const layourRouter = express.Router();

layourRouter.post(
  '/create-layout',
  isAuthenticated,
  authorizeRoles('admin'),
  createLayout,
);

export default layourRouter;
