import { NextFunction, Request, Response } from 'express';
import { TypedRequest } from '../../utils/typed-request';
import { ChangePasswordDto } from './user.dto';
import UserService from './user.service';
import { User } from './user.entity';
import { WrongCredentialsError } from '../../errors/wrong-credentials.error';

/** GET /account/me — aggregato home (saldo + ultimi movimenti: modulo movimenti). */
export const getAccountMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const utente = req.user as User;
    res.json({
      utente,
      // TODO movimenti: saldo reale e ultimi 5 movimenti
      saldo: 0,
      ultimiMovimenti: [],
    });
  } catch (err) {
    next(err);
  }
};

/** GET /account/profilo — dati conto senza password (schema User). */
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

/** PATCH /account/password */
export const changePassword = async (
  req: TypedRequest<ChangePasswordDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.user as User).id;
    const { vecchiaPassword, nuovaPassword } = req.body;
    const updated = await UserService.updatePassword(userId, vecchiaPassword, nuovaPassword);
    res.json(updated);
  } catch (err) {
    if (err instanceof WrongCredentialsError) {
      res.status(400).json({ error: err.name, message: err.message });
      return;
    }
    next(err);
  }
};
