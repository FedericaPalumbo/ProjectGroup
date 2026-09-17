//validazione input
import { IsString, Matches } from 'class-validator';

const passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$';

export class ChangePasswordDto {
  @IsString()
  vecchiaPassword: string;

  @Matches(new RegExp(passwordPattern), {
    message:
      'nuovaPassword must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
  })
  nuovaPassword: string;

  @IsString()
  confermaNuovaPassword: string;
}
