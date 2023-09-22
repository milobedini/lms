import { NextFunction, Request, Response } from 'express';

export const CatchAsyncError =
  (incomingFunction: any) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(incomingFunction(req, res, next)).catch(next);
  };
