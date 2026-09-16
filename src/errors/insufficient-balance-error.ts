import { NextFunction, Request, Response } from 'express';

export class InsufficientBalanceError extends Error {
  constructor() {
    super();
    this.message = 'Insufficient balance';
    this.name = 'InsufficientBalance';
  }
};

export const insufficientBalanceHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof InsufficientBalanceError) {
    res.status(422);
    res.json({
      error: err.name,
      message: err.message
    });
  } else {
    next(err);
  }
}