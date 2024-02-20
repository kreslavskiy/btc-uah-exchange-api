import { IsEmail } from 'class-validator';

export class CreateEmailSchema {
  @IsEmail()
  public readonly email: string;
}
