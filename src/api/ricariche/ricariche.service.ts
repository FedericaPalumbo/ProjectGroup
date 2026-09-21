import { NotFoundError } from '../../errors/not-found.error';
import { InsufficientBalanceError } from '../../errors/insufficient-balance-error';
import MovimentiService from '../movimenti/movimento.service';
import CategorieMovimentiService from '../categorie/categorie.service';
import { Ricarica, RicaricaResult } from './ricariche.entity';
import { nomeRicarica } from './ricariche.model';

export class RicaricheService {
  //effettua(contoCorrenteId, dati): 6.1/6.2 verifica saldo disponibile e crea il movimento di ricarica
  async effettuaRicarica(contoCorrenteId: string, dati: Ricarica): Promise<RicaricaResult> {
    const categoria = await CategorieMovimentiService.findByNome(nomeRicarica);
    if (!categoria) {
      throw new NotFoundError(); //categoria "Ricarica" non censita in TCategorieMovimenti
    }

    const saldoAttuale = await MovimentiService.getSaldo(contoCorrenteId);
    if (saldoAttuale < dati.taglio) {
      throw new InsufficientBalanceError(); //6.2 saldo insufficiente
    }

    const movimento = await MovimentiService.creaMovimento({
      contoCorrenteId,
      importo: -dati.taglio, //ricarica = uscita
      categoriaMovimentoId: categoria.id,
      descrizioneEstesa: `Ricarica telefonica ${dati.operatore} - ${dati.numeroTelefonico} - €${dati.taglio}`,
    });

    return {
      movimentoId: movimento.id,
      saldo: movimento.saldo,
      data: movimento.data,
    };
  }
}

export default new RicaricheService();