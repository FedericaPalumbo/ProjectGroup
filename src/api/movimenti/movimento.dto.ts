import { Type } from "class-transformer";
import { IsDate, IsIn, IsInt, IsMongoId, IsOptional, Min } from "class-validator";
import { Movimento } from "./movimento.entity";

/** Query string di GET /movimenti */
export class ListMovimentiQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number;

  @IsOptional()
  @IsMongoId()
  categoriaId?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dataInizio?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dataFine?: Date;

  @IsOptional()
  @IsIn(['csv', 'xlsx'])
  format?: 'csv' | 'xlsx';
}

/** Input di MovimentoService.creaMovimento: data e saldo li calcola il service */
export type CreaMovimentoDto = Pick<Movimento, 'contoCorrenteId' | 'categoriaMovimentoId' | 'importo' | 'descrizioneEstesa'>;