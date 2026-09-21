import { NextFunction, Request, Response } from 'express';

export class MissingIbanError extends Error {
  constructor() {
    super();
    this.message = 'Account has no IBAN assigned';
    this.name = 'MissingIban';
  }
};

export const missingIbanHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof MissingIbanError) {
    res.status(422);
    res.json({
      error: err.name,
      message: err.message
    });
  } else {
    next(err);
  }
}