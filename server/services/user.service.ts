import { Response } from 'express';
import userModel from '../models/user.model';
import { redis } from '../utils/redis';
// Get User by ID
export const getUserById = async (id: string, res: Response) => {
  const userJson = await redis.get(id);
  if (userJson) {
    const user = JSON.parse(userJson);
    res.status(201).json({
      success: true,
      user,
    });
  }
};

// GET all users, admin only.
export const getAllUsersService = async (res: Response) => {
  const users = await userModel.find().sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    users,
  });
};

// UPDATE user role, admin only.
export const updateUserRoleService = async (
  res: Response,
  id: string,
  role: string,
) => {
  const user = await userModel.findByIdAndUpdate(
    id,
    {
      role,
    },
    { new: true },
  );

  res.status(201).json({
    success: true,
    user,
  });
};
