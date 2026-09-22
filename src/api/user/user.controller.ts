import { NextFunction, Request, Response } from 'express';
import { TypedRequest } from '../../utils/typed-request';
import { ChangeIbanDto, ChangePasswordDto } from './user.dto';
import UserService from './user.service';
import { User } from './user.entity';
import { WrongCredentialsError } from '../../errors/wrong-credentials.error';
import { PasswordMismatchError } from '../../errors/password-mismatch';
import { getClientIp } from '../../utils/get-client-ip';
import OperationLogService from '../operation-log/operation-log.service';
import { confirmParams } from '../auth/auth.dto';
import { NotFoundError } from '../../errors/not-found.error';
import MovimentoService from '../movimenti/movimento.service';

/** GET /account/me — aggregato home (saldo + ultimi movimenti: modulo movimenti). */
//getAccountMe: prende l'utente da req.user (già autenticato) e restituisce un aggregato home. saldo è quello corrente di user; ultimiMovimenti è ancora hardcoded a []. DA FARE
export const getAccountMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const utente = req.user as User;
    const ultimiMovimenti = await MovimentoService.list(utente.id, { limit: 5 });

    res.json({
      utente,
      saldo: utente.saldo,
      ultimiMovimenti,
    });
  } catch (err) {
    next(err);
  }
};

/** GET /account/profilo — dati conto senza password (schema User). */
//getAccountProfile: recupera il profilo via UserService.findById, 404 se non trovato.
export const getAccountProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as User).id;
    const profilo = await UserService.findById(userId);

    if (!profilo) {
      res.status(404).json({ error: 'NotFound', message: 'User not found' });
      return;
    }
    res.json(profilo);
  } catch (err) {
    next(err);
  }
};

/** PATCH /account/iban */
//changeIban: chiama UserService.updateIban; ogni errore passa a next(err) per l'error handler generico.
export const changeIban = async (
  req: TypedRequest<ChangeIbanDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.user as User).id;
    const updated = await UserService.updateIban(userId, req.body.iban);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/** PATCH /account/password */
//changePassword: chiama UserService.updatePassword, intercetta WrongCredentialsError per rispondere 400, altrimenti passa a next(err) per l'error handler generico.
export const changePassword = async (
  req: TypedRequest<ChangePasswordDto>,
  res: Response,
  next: NextFunction
) => {
  const userId = (req.user as User).id;
  const ip = getClientIp(req);

  try {
    const { vecchiaPassword, nuovaPassword, confermaNuovaPassword } = req.body;

    if (nuovaPassword !== confermaNuovaPassword) {
      throw new PasswordMismatchError();  //se le 2 password non combaciano lancia errore
    }

    const updated = await UserService.updatePassword(userId, vecchiaPassword, nuovaPassword);

    await OperationLogService.registra('CambioPassword', true, ip, userId);

    res.json(updated);

  } catch (err) {
    if (err instanceof WrongCredentialsError) {
      await OperationLogService.registra('CambioPassword', false, ip, userId);
      res.status(400).json({ error: err.name, message: err.message });
      return;
    }
    next(err);
  }

};

export const confirmEmail = async (
  req: TypedRequest<unknown, unknown, confirmParams>,
  res: Response,
  next: NextFunction) => {
  try {
    const user = await UserService.confirmByToken(req.params.token);
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