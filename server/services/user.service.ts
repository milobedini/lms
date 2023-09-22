import { Response } from 'express';
import userModel from '../models/user.model';
// Get User by ID
export const getUserById = async (id: string, res: Response) => {
  const user = await userModel.findById(id);
  res.status(201).json({
    success: true,
    user,
  });
};
