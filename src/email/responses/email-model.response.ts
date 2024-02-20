import { Exclude, Expose } from 'class-transformer';
import { $Enums, Email, Status } from '@prisma/client';

@Exclude()
export class EmailModelResponse {
  @Expose()
  public readonly id: string;
  
  @Expose()
  public readonly email: string;

  @Expose()
  public readonly status: Status;

  @Expose()
  public readonly createdAt: Date;

  @Expose()
  public readonly deletedAt?: Date;

  constructor(email: Email) {
    Object.assign(this, email);

    this.createdAt = new Date(email.createdAt);
    this.deletedAt = email.deletedAt && new Date(email.deletedAt);
  }
}
