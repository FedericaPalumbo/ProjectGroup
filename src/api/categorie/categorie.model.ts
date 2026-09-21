// src/api/categorie/categorie.model.ts

import { model, Schema } from "mongoose";
import { CategoriaRecord } from "./categorie.entity";

function sanitizeCategoriaForApi(ret: Record<string, unknown>) {
  delete ret._id;
  delete ret.__v;
  return ret;
}

const categoriaSchema = new Schema<CategoriaRecord>({ //definisce cosa finisce davvero nel db
  nomeCategoria: { type: String, required: true },
  tipologia: { type: String, required: true, enum: ['Entrata', 'Uscita'] },
});

categoriaSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => sanitizeCategoriaForApi(ret as Record<string, unknown>),
});

categoriaSchema.set('toObject', {
  virtuals: true,
  transform: (_, ret) => sanitizeCategoriaForApi(ret as Record<string, unknown>),
});

export const CategoriaModel = model<CategoriaRecord>('Categoria', categoriaSchema, 'TCategorieMovimenti');