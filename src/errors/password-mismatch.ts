import { NextFunction, Request, Response } from 'express';

export class PasswordMismatchError extends Error {
  constructor() {
    super();
    this.message = 'Passwords do not match';
    this.name = 'PasswordMismatch';
  }
};

export const passwordMismatchHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof PasswordMismatchError) {
    res.status(400);
    res.json({
      error: err.name,
      message: err.message
    });
  } else {
    next(err);
  }
}