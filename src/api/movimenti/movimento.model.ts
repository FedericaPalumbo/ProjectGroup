import { model, Schema } from "mongoose";
import { MovimentoRecord } from "./movimento.entity";

function sanitizeMovimentoForApi(ret: Record<string, unknown>) {
  delete ret._id;
  delete ret.__v;
  return ret;
}

const movimentoSchema = new Schema<MovimentoRecord>({ //definisce cosa finisce davvero nel db
  contoCorrenteId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  data: { type: Date, default: Date.now },
  importo: { type: Number, required: true },
  saldo: { type: Number, required: true },
  categoriaMovimentoId: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
  descrizioneEstesa: { type: String, required: true },
});

// "categoria" non è salvata sul movimento: si ricava da categoriaMovimentoId con .populate('categoria')
movimentoSchema.virtual('categoria', {
  ref: 'Categoria',
  localField: 'categoriaMovimentoId',
  foreignField: '_id',
  justOne: true,
});

// ricerche "ultimi n movimenti del conto" in ordine di data decrescente
movimentoSchema.index({ contoCorrenteId: 1, data: -1 });

movimentoSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => sanitizeMovimentoForApi(ret as Record<string, unknown>),
});

movimentoSchema.set('toObject', {
  virtuals: true,
  transform: (_, ret) => sanitizeMovimentoForApi(ret as Record<string, unknown>),
});

export const MovimentoModel = model<MovimentoRecord>('Movimento', movimentoSchema);