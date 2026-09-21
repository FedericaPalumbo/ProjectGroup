import { Transform } from 'class-transformer';
import { IsNumber, IsPositive, Matches } from 'class-validator';

export class BonificoDto {
  // pulizia dei dati (-> toglie gli spazi (value.replace(/\s+/g, '')) + trasforma tutte le lettere in maiuscolo (.toUpperCase())) prima di validare e di cercare su db
  @Transform(({ value }) => (typeof value === 'string' ? value.replace(/\s+/g, '').toUpperCase() : value))
  ibanDestinatario: string;

  /*
  // verifica che la stringa assomigli a un IBAN standard (es: iniziare con 2 lettere maiscole, poi due numeri, ...)
  @Matches(/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/, { message: 'ibanDestinatario is not a valid IBAN' })
  
  */

  @IsNumber({ maxDecimalPlaces: 2 }) //massimo 2 decimali
  @IsPositive() //per evitare importi negativi -> -50€
  importo: number;
}