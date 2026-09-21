import { Types } from 'mongoose';
import { Categoria } from '../categorie/categorie.entity';

export type Movimento = { //tipo "pubblico": dati che vengono restituiti dalle API
  id: string;
  contoCorrenteId: string;
  data: Date;
  importo: number;
  saldo: number;
  categoriaMovimentoId: string;
  categoria?: Categoria; //virtual: presente solo se popolato
  descrizioneEstesa: string;
};

/*
  Record che rimane in DB: senza id e senza il virtual categoria;
  i riferimenti a conto e categoria sono salvati come ObjectId.
 */
export type MovimentoRecord = Omit<Movimento, 'id' | 'categoria' | 'contoCorrenteId' | 'categoriaMovimentoId'> & {
  contoCorrenteId: Types.ObjectId;
  categoriaMovimentoId: Types.ObjectId;
};