/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { IUser } from '../models/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
