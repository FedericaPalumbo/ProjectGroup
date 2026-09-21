import { NextFunction, Request, Response } from 'express';

export class sameAccountError extends Error {
  constructor() {
    super();
    this.message = 'Cannot transfer to your own account';
    this.name = 'SameAccount';
  }
};

export const sameAccountHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof sameAccountError) {
    res.status(400);
    res.json({
      error: err.name,
      message: err.message
    });
  } else {
    next(err);
  }
}