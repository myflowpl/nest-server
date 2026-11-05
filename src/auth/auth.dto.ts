import { IsEmail, MinLength } from 'class-validator';

export class RegisterDto {
  /** Adres email (unikalny) */
  @IsEmail()
  email: string;

  /** Hasło, minimum 6 znaków */
  @MinLength(6)
  password: string;

  /** Nazwa wyświetlana w profilu */
  @MinLength(2)
  displayName: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
