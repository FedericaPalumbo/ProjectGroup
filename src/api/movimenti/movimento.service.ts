import { Workbook } from 'exceljs';
import { connection } from 'mongoose';
import { InsufficientBalanceError } from '../../errors/insufficient-balance-error';
import CategorieService from '../categorie/categorie.service';
import { CreaMovimentoDto, ListMovimentiQueryDto } from './movimento.dto';
import { Movimento } from './movimento.entity';
import { MovimentoModel } from './movimento.model';
import { MissingIbanError } from '../../errors/missing-iban.error';
import UserService from '../user/user.service';

/** Ordine "dal più recente": _id come spareggio se due movimenti hanno la stessa data. */
const ORDINE_RECENTI = { data: -1, _id: -1 } as const;

/** toJSON aggiunge id (virtual Mongoose); il cast evita falsi negativi del type checker su MovimentoRecord. */
//toPublicMovimento(doc): converte un documento Mongoose in Movimento pubblico chiamando toJSON()
function toPublicMovimento(doc: { toJSON(): unknown }): Movimento {
  return doc.toJSON() as unknown as Movimento;
}

/** dataFine arriva senza orario (00:00): la porta a fine giornata per includere i movimenti di quel giorno. */
function fineGiornata(data: Date): Date {
  const fine = new Date(data);
  fine.setUTCHours(23, 59, 59, 999);
  return fine;
}

export class MovimentoService {

  //creaMovimento: unico punto in cui si scrive un movimento. Calcola il nuovo saldo (importo con segno: negativo = uscita)
  //e, se andrebbe sotto zero, lancia InsufficientBalanceError: ricariche e bonifici non devono rifare il controllo.
  async creaMovimento(movimento: CreaMovimentoDto): Promise<Movimento> {
    if (movimento.importo !== 0) {
      const conto = await UserService.findById(movimento.contoCorrenteId);
      if (!conto?.iban) {
        throw new MissingIbanError();
      }
    }
    //transazione: se la create fallisce, anche l'aggiornamento del saldo su user viene annullato
    return connection.transaction(async session => {
      const saldo = await UserService.applicaImporto(movimento.contoCorrenteId, movimento.importo, session);
      const [doc] = await MovimentoModel.create([{ ...movimento, saldo }], { session }); //con la session, create vuole l'array
      return toPublicMovimento(doc);
    });
  }

  //creaAperturaConto: movimento di apertura con importo e saldo a 0, chiamato da auth dopo la conferma della registrazione
  async creaAperturaConto(contoCorrenteId: string): Promise<Movimento> {
    const categoria = await CategorieService.findByNome('Apertura Conto');
    if (!categoria) {
      // Error generico (500) e non NotFoundError: confirmRegistration lo tradurrebbe in "token non valido"
      throw new Error("Categoria 'Apertura Conto' non presente: caricare le categorie iniziali");
    }

    return this.creaMovimento({
      contoCorrenteId,
      categoriaMovimentoId: categoria.id,
      importo: 0,
      descrizioneEstesa: 'Apertura Conto',
    });
  }

  //list: ultimi n movimenti del conto, dal più recente, con filtri opzionali per categoria e intervallo di date.
  //Serve sia alle ricerche sia alla home (limit: 5)
  async list(contoCorrenteId: string, filtri: ListMovimentiQueryDto): Promise<Movimento[]> {
    const { limit, categoriaId, dataInizio, dataFine } = filtri;

    const query = MovimentoModel.find({ contoCorrenteId })
      .sort(ORDINE_RECENTI)
      .limit(limit)
      .populate('categoria');

    if (categoriaId) {
      query.where({ categoriaMovimentoId: categoriaId });
    }
    if (dataInizio) {
      query.where('data').gte(dataInizio.getTime());
    }
    if (dataFine) {
      query.where('data').lte(fineGiornata(dataFine).getTime());
    }

    const docs = await query;
    return docs.map(toPublicMovimento);
  }

  //esporta: genera il file csv o xlsx con Data, Importo e Categoria dei movimenti passati (stessa logica per i due formati)
  async esporta(movimenti: Movimento[], format: 'csv' | 'xlsx'): Promise<Buffer> {
    const workbook = new Workbook();
    const sheet = workbook.addWorksheet('Movimenti');

    sheet.columns = [
      { header: 'Data', key: 'data' },
      { header: 'Importo', key: 'importo' },
      { header: 'Categoria', key: 'categoria' },
    ];
    sheet.addRows(movimenti.map(m => ({ data: m.data, importo: m.importo, categoria: m.categoria?.nomeCategoria })));

    return Buffer.from(await workbook[format].writeBuffer());
  }

  //findById: dettaglio di un movimento, solo se appartiene al conto (altrimenti null → il controller risponde 404)
  async findById(contoCorrenteId: string, id: string): Promise<Movimento | null> {
    const doc = await MovimentoModel.findOne({ _id: id, contoCorrenteId }).populate('categoria');
    return doc ? toPublicMovimento(doc) : null;
  }
}

export default new MovimentoService();