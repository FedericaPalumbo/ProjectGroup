/*
 * Non esiste una TRicariche nel database del Project Work: non c'è quindi uno Schema/Model
 * Mongoose come in user.model.ts. Questo file resta comunque nel modulo (stesso pattern degli
 * altri moduli) per contenere i valori di dominio ammessi, usati sia dal dto che dal service.
 */
import { OperatoreTelefonico, TaglioRicarica } from './ricariche.entity';

export const operatori: OperatoreTelefonico[] = [
  'iliad',
  'tim',
  'vodafone',
  'windtre',
  'postemobile',
];

export const tagli: TaglioRicarica[] = [5, 10, 20, 30, 50];

// ASSUNZIONE: nome esatto della riga in TCategorieMovimenti da usare per il lookup del CategoriaMovimentoID.
export const nomeRicarica = 'Ricarica';