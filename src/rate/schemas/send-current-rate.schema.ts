import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SendCurrentRateSchema {
  @IsEmail(undefined, { each: true })
  public readonly emails: string[];

  @IsString()
  @IsOptional()
  public readonly message?: string;
}
