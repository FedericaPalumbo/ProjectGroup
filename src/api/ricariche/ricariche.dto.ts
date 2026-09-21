//validazione input
import { IsIn, Matches } from 'class-validator';
import { OperatoreTelefonico, TaglioRicarica } from './ricariche.entity';
import { operatori, tagli } from './ricariche.model';

export class RicaricaDto {
  @Matches(/^\+?\d{6,15}$/, { message: 'numeroTelefonico non valido' })
  numeroTelefonico: string;

  @IsIn(operatori, {
    message: `operatore deve essere uno tra: ${operatori.join(', ')}`,
  })
  operatore: OperatoreTelefonico;

  @IsIn(tagli, {
    message: `taglio deve essere uno tra: ${tagli.join(', ')}`,
  })
  taglio: TaglioRicarica;
}