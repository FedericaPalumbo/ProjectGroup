import { IsEmail, IsString, Matches } from "class-validator";

const passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$';

export class registerDto {
  @IsEmail()
  email: string;

  @Matches(new RegExp(passwordPattern), {
    message:
      'password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
  })
  password: string;

  @IsString()
  confermaPassword: string;

  @IsString()
  nomeTitolare: string;

  @IsString()
  cognomeTitolare: string;
}

export class loginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class confirmParams {
  @Matches(/^[a-f0-9]{64}$/, { message: 'invalid confirmation token' })
  token: string;
}