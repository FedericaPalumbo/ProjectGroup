export type ModificaSaldo = { //tipo "pubblico": Dati che vengono restituiti dalle API
  id: string;
  saldo: number;
  dataModificaSaldo: Date;
};

export type ModificaSaldoRecord = Omit<ModificaSaldo, 'id'>; // Record che rimane in DB