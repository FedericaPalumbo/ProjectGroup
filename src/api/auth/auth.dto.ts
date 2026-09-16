import { IsEmail, IsString, IsUrl, Matches } from "class-validator";

export class registerDto {
  @IsEmail()
  username: string;

  @Matches(
    new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$'),
    {
      message: 'password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character'
    }
  )
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsUrl()
  picture: string;
}

export class loginDto {
  @IsEmail()
  username: string;

  @IsString()
  password: string;
}