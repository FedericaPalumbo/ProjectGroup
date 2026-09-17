import { NextFunction, Request, Response } from "express";
import { TypedRequest } from "../../utils/typed-request";
import { registerDto } from "./auth.dto";
import UserService from "../user/user.service";
import { pick } from 'lodash';
import { UserExistsError } from "../../errors/user-exists.error";
import passport from "passport";
import * as jwt from 'jsonwebtoken';

export const register = async (
  req: TypedRequest<registerDto>,
  res: Response,
  next: NextFunction) => {
  try {
    const profile = pick(req.body, 'nomeTitolare', 'cognomeTitolare');
    const credentials = { username: req.body.email, password: req.body.password };

    const newUser = await UserService.add(profile, credentials);
    res.status(201).json(newUser);

  } catch (err) {
    if (err instanceof UserExistsError) {
      res.status(400);
      res.json({
        error: err.name,
        message: err.message
      });
    } else {
      next(err);
    }
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction) => {
  try {
    passport.authenticate('local',
      { session: false },
      (loginErr, user, info) => {

        if (loginErr) {
          next(loginErr);
          return;
        }

        if (!user) {
          res.status(401);
          res.json({
            error: 'LoginError',
            message: info.message
          });
          return;
        }

        // generare token
        const token = jwt.sign(user, 'my_jwt_secret', { expiresIn: '7 days' })
        res.json({
          user,
          token
        });
      }
    )(req, res, next);
  } catch (err) {
    next(err);
  }
}