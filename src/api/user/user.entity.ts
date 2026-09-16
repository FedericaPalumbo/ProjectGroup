/**
 * Contratto API pubblico — allineato a components/schemas/User (OpenAPI).
 * Usato nelle risposte e da account/auth; non include campi solo persistenza.
 */
export type User = {
  id: string;
  email: string;
  nomeTitolare: string;
  cognomeTitolare: string;
  dataApertura: Date;
  iban: string;
};

/**
 * Campi aggiuntivi sul documento Mongoose (TContiCorrenti).
 * Non compaiono nello swagger: vanno sempre rimossi in toJSON/toObject (vedi user.model).
 */
export type UserInternalFields = {
  /** Flusso auth GET /register/confirm/:token — non cercare su UserIdentity */
  confirmationToken?: string;
  confirmationTokenExpires?: Date;
  emailConfermata: boolean;
};

/** Record persistito in DB (dominio conto corrente). Stile api-server: tipo unico sullo schema, senza HydratedDocument. */
export type UserRecord = Omit<User, 'id'> & UserInternalFields;
