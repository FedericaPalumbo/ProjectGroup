import { NextFunction, Response } from 'express';
import { TypedRequest } from '../../utils/typed-request';
import { getClientIp } from '../../utils/get-client-ip';
import { NotFoundError } from '../../errors/not-found.error';
import { sameAccountError } from '../../errors/same-credentials.error';
import CategorieService from '../categorie/categorie.service';
import MovimentoService from '../movimenti/movimento.service';
import OperationLogService from '../operation-log/operation-log.service';
import { User } from '../user/user.entity';
import { UserModel } from '../user/user.model';
import { BonificoDto } from './bonifico.dto';

/* POST: /bonifici */
export const createBonifico = async (req: TypedRequest<BonificoDto>, res: Response, next: NextFunction) => {
  const mittente = req.user as User;
  const ip = getClientIp(req);

  try {
    const { ibanDestinatario, importo } = req.body;

    // 1. Va verificato che l’IBAN sia presente in TContiCorrenti 
    const destinatario = await UserModel.findOne({ iban: ibanDestinatario });
    if (!destinatario) {
      throw new NotFoundError();
    }
    if (destinatario.id === mittente.id) {
      throw new sameAccountError();
      // non posso auto-inviarmi un bonifico -> devo accertarmi che l'account del mittente sia diverso da quello del destinatario
    }

    // Recupero l'unica categoria "Bonifico" presente a database
    const categoriaBonifico = await CategorieService.findByNome('Bonifico');
    if (!categoriaBonifico) {
      throw new Error("Categoria 'Bonifico' non presente: caricare le categorie iniziali");
    }

    // 2. addebito al mittente + 3. verifica il saldo
    const uscita = await MovimentoService.creaMovimento({
      contoCorrenteId: mittente.id,
      categoriaMovimentoId: categoriaBonifico.id,
      importo: -importo, // uscita = importo negativo
      descrizioneEstesa:
        `Bonifico disposto a favore di ${destinatario.nomeTitolare} ${destinatario.cognomeTitolare} (${destinatario.iban})`,
    });

    // accredito al destinatario:
    try {
      await MovimentoService.creaMovimento({
        contoCorrenteId: destinatario.id,
        categoriaMovimentoId: categoriaBonifico.id,
        importo,
        descrizioneEstesa: `Bonifico disposto da ${mittente.nomeTitolare} ${mittente.cognomeTitolare}`,
      });
    } catch (err) {
      // in caso di accredito fallito: ritorno l'addebito così il mittente non perde i soldi
      await MovimentoService.creaMovimento({
        contoCorrenteId: mittente.id,
        categoriaMovimentoId: categoriaBonifico.id,
        importo,
        descrizioneEstesa: 'Storno bonifico non eseguito',
      }).catch(e => console.error('Storno bonifico non riuscito', e));
      throw err;
    }

    // 4. log dell'operazione riuscita
    await OperationLogService.registra('Bonifico', true, ip, mittente.id)
      .catch(err => console.error('Log Bonifico non salvato', err));

    // rileggo il movimento con la categoria popolata (creaMovimento restituisce un oggetto semplice)
    const dettaglio = await MovimentoService.findById(mittente.id, uscita.id);
    res.status(201).json(dettaglio ?? uscita);

  }

  catch (err) {
    await OperationLogService.registra('Bonifico', false, ip, mittente.id)
      .catch(e => console.error('Log Bonifico non salvato', e));

    next(err); // NotFound -> 404, InsufficientBalance / SameAccount -> 400 (handler globali)
  }
}