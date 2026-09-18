import { NextFunction, Request, Response } from "express";
import { TypedRequest } from "../../utils/typed-request";
import { confirmParams, registerDto } from "./auth.dto";
import UserService from "../user/user.service";
import { pick } from 'lodash';
import { UserExistsError } from "../../errors/user-exists.error";
import { PasswordMismatchError } from "../../errors/password-mismatch";
import { NotFoundError } from "../../errors/not-found.error";
import passport from "passport";
import * as jwt from 'jsonwebtoken';

export const register = async (
  req: TypedRequest<registerDto>,
  res: Response,
  next: NextFunction) => {
  try {
    if (req.body.password !== req.body.confermaPassword) {
      throw new PasswordMismatchError(); //stesso controllo/errore usato in changePassword ma qua si controlla la password nuova e quella nuova confermata (per il cambio password)
    }

    const profile = pick(req.body, 'nomeTitolare', 'cognomeTitolare');
    const credentials = { username: req.body.email, password: req.body.password };

    const newUser = await UserService.add(profile, credentials);

    // TODO: inviare email di conferma con link tipo `${FRONTEND_URL}/confirm/${confirmationToken}`.
    // AAA Manca ancora un servizio di mailing (es. nodemailer) nel progetto.


    res.status(201).json(newUser);

  } catch (err) {
    if (err instanceof UserExistsError) {
      res.status(400);
      res.json({
        error: err.name,
        message: err.message
      });
    } else {
      next(err); // PasswordMismatchError finisce qui, gestito dal passwordMismatchHandler globale
    }
  }
}

export const confirmRegistration = async (
  req: TypedRequest<unknown, unknown, confirmParams>,
  res: Response,
  next: NextFunction) => {
  try {
    const user = await UserService.confirmByToken(req.params.token);

    // TODO: quando sarà implementato il modulo "movimenti", richiamare qui V
    // MovimentoService.creaAperturaConto(user.id) per il movimento di apertura a saldo 0.

    res.json(user);
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(400);
      res.json({
        error: 'InvalidToken',
        message: 'token di conferma non valido o scaduto'
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