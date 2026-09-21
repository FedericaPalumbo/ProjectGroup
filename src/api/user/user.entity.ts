export type User = { //tipo "pubblico": Dati che vengono restituiti dalle API
  id: string;
  email: string;
  nomeTitolare: string;
  cognomeTitolare: string;
  dataApertura: Date;
  iban: string;
  saldo: number;
};

/*
  Campi aggiuntivi sul documento Mongoose (TContiCorrenti).
  Non compaiono nello swagger: vanno sempre rimossi in toJSON/toObject (vedi user.model).
 */
export type UserInternalFields = { //DATI CHE NON DEVONO ANDARE NELLE API
  // Flusso auth GET /register/confirm/:token — non cercare su UserIdentity 
  confirmationToken?: string;
  confirmationTokenExpires?: Date;
  emailConfermata: boolean;
};

// Record che rimane in DB (dominio conto corrente).
export type UserRecord = Omit<User, 'id'> & UserInternalFields; //User senza id (che è virtuale, lo genera Mongoose) + i campi interni.
