// src/api/categorie/categorie.service.ts

import { Categoria } from './categorie.entity';
import { CategoriaModel } from './categorie.model';
import { CategoriaExistsError } from '../../errors/categoria-exists.error';

/** toJSON aggiunge id (virtual Mongoose); il cast evita falsi negativi del type checker su CategoriaRecord. */
function toPublicCategoria(doc: { toJSON(): unknown }): Categoria {
  return doc.toJSON() as unknown as Categoria;
}

export class CategorieService {
  //findAll(): ritorna tutte le categorie movimento, usate per popolare filtri/dropdown nel frontend
  async findAll(): Promise<Categoria[]> {
    const docs = await CategoriaModel.find();
    return docs.map(toPublicCategoria);
  }
  //findByNome(nomeCategoria): usata da movimenti per ricavare la categoria dal nome (es. 'Apertura Conto'); null se non esiste
  async findByNome(nomeCategoria: string): Promise<Categoria | null> {
    const doc = await CategoriaModel.findOne({ nomeCategoria });
    return doc ? toPublicCategoria(doc) : null;
  }


  async add(data: { nomeCategoria: string; tipologia: 'Entrata' | 'Uscita' }): Promise<Categoria> {
    const existing = await CategoriaModel.findOne({ nomeCategoria: data.nomeCategoria });
    if (existing) {
      throw new CategoriaExistsError();
    }

    const doc = await CategoriaModel.create(data);
    return toPublicCategoria(doc);
  }
}

export default new CategorieService();