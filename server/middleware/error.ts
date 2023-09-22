import { Request, Response } from 'express';
import ErrorHandler from '../utils/ErrorHandler';

export const ErrorMiddleware = (err: any, req: Request, res: Response) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  //   Wrong mongoDB id error from FE
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //   Duplicate key error (authentication etc.)
  if (err.code === 1000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  //   jwt error
  if (err.name === 'JsonWebTokenError') {
    const message = `Json web token is invalid, please try again`;
    err = new ErrorHandler(message, 400);
  }

  //   jwt expired error
  if (err.name === 'TokenExpiredError') {
    const message = 'Json web token has expured, try again';
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message
  });
};
