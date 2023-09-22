import express from 'express';
import {
  confirmUser,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  socialLogin,
  updateAccessToken,
} from '../controllers/user.controller';
import { isAuthenticated } from '../middleware/auth';
const userRouter = express.Router();

userRouter.post('/registration', registrationUser);
userRouter.post('/activate', confirmUser);
userRouter.post('/login', loginUser);
userRouter.post('/social-login', socialLogin);
userRouter.get('/logout', isAuthenticated, logoutUser);
userRouter.get('/refresh-token', updateAccessToken);
// userRouter.get('/logout', isAuthenticated, authorizeRoles('admin'), logoutUser);

userRouter.get('/profile', isAuthenticated, getUserInfo);

export default userRouter;
