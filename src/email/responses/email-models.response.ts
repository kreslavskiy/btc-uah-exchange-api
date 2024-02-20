import { Email } from '@prisma/client';
import { EmailModelResponse } from './email-model.response';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class EmailModelsResponse {
  @Expose()
  public readonly emails: EmailModelResponse[];

  constructor(emails: Email[]) {
    this.emails = emails.map((email) => new EmailModelResponse(email));
  }
}
