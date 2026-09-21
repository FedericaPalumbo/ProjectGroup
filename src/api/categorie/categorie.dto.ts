// src/api/categorie/categorie.dto.ts

import { IsIn, IsString, MinLength } from 'class-validator';

export class CreateCategoriaDto {
  @IsString()
  @MinLength(1)
  nomeCategoria: string;

  @IsIn(['Entrata', 'Uscita'], {
    message: 'tipologia deve essere Entrata oppure Uscita',
  })
  tipologia: 'Entrata' | 'Uscita';
}