/*
 * La ricarica NON ha una propria collection Mongoose: dal Project Work (punto 6) una ricarica
 * si traduce semplicemente in un nuovo record su TMovimentiContoCorrente con
 * CategoriaMovimentoID = categoria "Ricarica" (Tipologia = "Uscita").
 * Qui teniamo solo i tipi di dominio, sul modello di quanto fatto in user.entity.ts.
 */

// ASSUNZIONE: lista operatori/tagli ammessi. Da confermare con le specifiche reali.
export type OperatoreTelefonico = 'iliad' | 'tim' | 'vodafone' | 'windtre' | 'postemobile';

export type TaglioRicarica = 5 | 10 | 20 | 30 | 50;

// Dati in ingresso di una ricarica (già validati dal RicaricaDto).
export type Ricarica = {
  numeroTelefonico: string;
  operatore: OperatoreTelefonico;
  taglio: TaglioRicarica;
};

// Risposta restituita al client dopo una ricarica andata a buon fine.
export type RicaricaResult = {
  movimentoId: string;
  saldo: number;
  data: Date;
};