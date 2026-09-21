import { NextFunction, Response } from 'express';
import { TypedRequest } from '../../utils/typed-request';
import { RicaricaDto } from './ricariche.dto';
import RicaricheService from './ricariche.service';
import { User } from '../user/user.entity';
import { getClientIp } from '../../utils/get-client-ip';
import OperationLogService from '../operation-log/operation-log.service';
import { InsufficientBalanceError } from '../../errors/insufficient-balance-error';
import { NotFoundError } from '../../errors/not-found.error';

/** POST /ricariche — 6.1/6.2/6.3: ricarica telefonica con verifica saldo e log IP/data/esito. */
//doRicarica: legge il conto dell'utente autenticato, chiama RicaricheService.effettua, logga l'esito
export const doRicarica = async (
  req: TypedRequest<RicaricaDto>,
  res: Response,
  next: NextFunction
) => {
  const userId = (req.user as User).id;
  const ip = getClientIp(req);

  try {
    const { numeroTelefonico, operatore, taglio } = req.body;

    const result = await RicaricheService.effettuaRicarica(userId, {
      numeroTelefonico,
      operatore,
      taglio,
    });

    await OperationLogService.registra('Ricarica', true, ip, userId);

    res.json(result);
  } catch (err) {
    if (err instanceof InsufficientBalanceError) {
      await OperationLogService.registra('Ricarica', false, ip, userId);
      res.status(400).json({ error: err.name, message: err.message });
      return;
    }
    if (err instanceof NotFoundError) {
      await OperationLogService.registra('Ricarica', false, ip, userId);
      res.status(404).json({
        error: 'CategoriaNonTrovata',
        message: 'Categoria "Ricarica" non configurata in TCategorieMovimenti',
      });
      return;
    }
    next(err);
  }
};