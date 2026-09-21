// src/api/categorie/categorie.entity.ts




export type Categoria = { //tipo "pubblico": Dati che vengono restituiti dalle API
  id: string;
  nomeCategoria: string;
  tipologia: 'Entrata' | 'Uscita';
};

/*
  Nessun campo interno da nascondere per le categorie (a differenza di User,
  qui non c'è nulla di sensibile), ma manteniamo comunque CategoriaRecord
  per coerenza con il pattern usato negli altri moduli.
 */
export type CategoriaRecord = Omit<Categoria, 'id'>; // Record che rimane in DB