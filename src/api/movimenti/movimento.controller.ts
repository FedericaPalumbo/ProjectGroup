import { NextFunction, Response } from 'express';
import { TypedRequest } from '../../utils/typed-request';
import { IdParams } from '../../utils/id-params';
import { NotFoundError } from '../../errors/not-found.error';
import { User } from '../user/user.entity';
import { ListMovimentiQueryDto } from './movimento.dto';
import MovimentoService from './movimento.service';

/** GET /movimenti — ultimi n movimenti con filtri opzionali (categoria, intervallo di date); con format esporta in csv/xlsx. */
//listMovimenti: saldoFinale è restituito solo senza filtri (RicercaMovimenti1); se dataInizio > dataFine risponde 400.
export const listMovimenti = async (
  req: TypedRequest<unknown, ListMovimentiQueryDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const contoCorrenteId = (req.user as User).id;
    const { categoriaId, dataInizio, dataFine, format } = req.query;

    if (dataInizio && dataFine && dataInizio.getTime() > dataFine.getTime()) {
      res.status(400).json({
        error: 'InvalidDateRange',
        message: 'dataInizio non può essere successiva a dataFine'
      });
      return;
    }

    const movimenti = await MovimentoService.list(contoCorrenteId, req.query);

    if (format) {
      const file = await MovimentoService.esporta(movimenti, format);
      res.attachment(`movimenti.${format}`).send(file); //attachment imposta anche il Content-Type dall'estensione
      return;
    }

    const senzaFiltri = !categoriaId && !dataInizio && !dataFine;
    const saldoFinale = senzaFiltri ? await MovimentoService.getSaldo(contoCorrenteId) : undefined;

    res.json({ movimenti, saldoFinale });
  } catch (err) {
    next(err);
  }
};

/** GET /movimenti/:id — dettaglio di un movimento del conto autenticato. */
//getMovimento: se il movimento non esiste o è di un altro conto lancia NotFoundError (404 dall'handler globale).
export const getMovimento = async (
  req: TypedRequest<unknown, unknown, IdParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const movimento = await MovimentoService.findById((req.user as User).id, req.params.id);
    if (!movimento) {
      throw new NotFoundError();
    }

    res.json(movimento);
  } catch (err) {
    next(err);
  }
};