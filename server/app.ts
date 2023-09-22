import { config } from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
export const app = express();
import cors from 'cors';
import cookieParser from 'cookie-parser';

config();

// Body parser
// Limit important for Cloudinary
app.use(express.json({ limit: '50mb' }));

// Cookie Parser
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: process.env.ORIGIN
  })
);

// Test API
app.get('/test', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'API is working'
  });
});

// Catchall Route
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});
