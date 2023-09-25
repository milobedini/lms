import express from 'express';
import {
  confirmUser,
  deleteUser,
  getAllUsers,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  socialLogin,
  updateAccessToken,
  updateUserAvatar,
  updateUserInfo,
  updateUserPassword,
  updateUserRole,
} from '../controllers/user.controller';
import { authorizeRoles, isAuthenticated } from '../middleware/auth';
const userRouter = express.Router();

userRouter.post('/registration', registrationUser);
userRouter.post('/activate', confirmUser);
userRouter.post('/login', loginUser);
userRouter.post('/social-login', socialLogin);
userRouter.get('/logout', isAuthenticated, logoutUser);
userRouter.get('/refresh-token', updateAccessToken);
// userRouter.get('/logout', isAuthenticated, authorizeRoles('admin'), logoutUser);

userRouter.get('/profile', isAuthenticated, getUserInfo);

userRouter.get(
  '/get-all-users',
  isAuthenticated,
  authorizeRoles('admin'),
  getAllUsers,
);

userRouter.put('/update-user', isAuthenticated, updateUserInfo);
userRouter.put('/update-password', isAuthenticated, updateUserPassword);
userRouter.put('/update-avatar', isAuthenticated, updateUserAvatar);
userRouter.put(
  '/update-role',
  isAuthenticated,
  authorizeRoles('admin'),
  updateUserRole,
);

userRouter.delete(
  '/delete-user/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  deleteUser,
);

export default userRouter;
