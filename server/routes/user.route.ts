import express from 'express';
import { confirmUser, registrationUser } from '../controllers/user.controller';
const userRouter = express.Router();

userRouter.post('/registration', registrationUser);
userRouter.post('/activate', confirmUser);

export default userRouter;
