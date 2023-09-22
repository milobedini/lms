import express from 'express';
import {
  confirmUser,
  loginUser,
  logoutUser,
  registrationUser,
} from '../controllers/user.controller';
import { isAuthenticated } from '../middleware/auth';
const userRouter = express.Router();

userRouter.post('/registration', registrationUser);
userRouter.post('/activate', confirmUser);
userRouter.post('/login', loginUser);
userRouter.get('/logout', isAuthenticated, logoutUser);
// userRouter.get('/logout', isAuthenticated, authorizeRoles('admin'), logoutUser);

export default userRouter;
