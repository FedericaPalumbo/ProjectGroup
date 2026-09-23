import { NextFunction, Request, Response } from "express";
import { TypedRequest } from "../../utils/typed-request";
import { confirmParams, registerDto, resendDto } from "./auth.dto";
import UserService from "../user/user.service";
import { pick } from 'lodash';
import { UserExistsError } from "../../errors/user-exists.error";
import { PasswordMismatchError } from "../../errors/password-mismatch";
import { NotFoundError } from "../../errors/not-found.error";
import passport from "passport";
import * as jwt from 'jsonwebtoken';
import { getClientIp } from "../../utils/get-client-ip";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../../utils/auth/jwt/jwt.config";
import OperationLogService from "../operation-log/operation-log.service";
import MovimentoService from "../movimenti/movimento.service";
import MailService from "../../utils/mail/mail.service";

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

    const { user: newUser, confirmationToken } = await UserService.add(profile, credentials);

    try {
      await MailService.inviaEmailConferma(newUser.email, newUser.nomeTitolare, confirmationToken);
    } catch (mailErr) {
      // utente comunque creato: logghiamo e basta, non blocchiamo la 201.
      // Se l'invio fallisce l'utente non resta bloccato: può richiedere un nuovo invio via POST /register/resend
      console.error('Invio email di conferma fallito:', mailErr);
    }

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

    await MovimentoService.creaAperturaConto(user.id); //movimento di apertura con importo e saldo a 0

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

export const resendConfirmation = async (
  req: TypedRequest<resendDto>,
  res: Response,
  next: NextFunction) => {
  try {
    const { user, confirmationToken } = await UserService.regenerateConfirmationToken(req.body.email);

    try {
      await MailService.inviaEmailConferma(user.email, user.nomeTitolare, confirmationToken);
    } catch (mailErr) {
      console.error('Invio email di conferma fallito:', mailErr);
    }

    res.json(user);

  } catch (err) {
    next(err); // NotFoundError e AlreadyConfirmedError gestiti dagli handler globali
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction) => {
  try {
    passport.authenticate('local',
      { session: false },
      async (loginErr, user, info) => {
        try {
          const ip = getClientIp(req);

          if (loginErr) {
            next(loginErr);
            return;
          }

          if (!user) {
            await OperationLogService.registra('Login', false, ip);
            res.status(401);
            res.json({
              error: 'LoginError',
              message: info.message
            });
            return;
          }

          await OperationLogService.registra('Login', true, ip, user.id);

          // generare token
          const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7 days' })
          res.json({
            user,
            token
          });

        } catch (err) {
          next(err);
        }
      }
    )(req, res, next);
  } catch (err) {
    next(err);
  }
}