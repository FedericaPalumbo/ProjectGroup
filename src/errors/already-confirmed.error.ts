import { NextFunction, Request, Response } from 'express';

export class AlreadyConfirmedError extends Error {
    constructor() {
        super();
        this.message = 'email already confirmed';
        this.name = 'AlreadyConfirmed';
    }
};

export const alreadyConfirmedHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AlreadyConfirmedError) {
        res.status(400);
        res.json({
            error: err.name,
            message: err.message
        });
    } else {
        next(err);
    }
}