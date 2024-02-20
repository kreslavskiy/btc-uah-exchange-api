import { Prisma } from '@prisma/client';
import { Status } from '../enums/email-status.enum';

export class Email implements Prisma.EmailCreateInput {
  public readonly id: string;

  public readonly email: string;

  public readonly status: Status;

  public readonly createdAt: Date;

  public readonly deletedAt?: Date;
}
