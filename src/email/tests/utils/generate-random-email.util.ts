import { Email } from '@prisma/client';
import * as crypto from 'crypto';
import { Status } from '../../../email/enums/email-status.enum';

export const generateRandomEmail = (partial?: Partial<Email>): Email => {
  const random: Email = {
    deletedAt: null,
    createdAt: new Date(),
    id: crypto.randomUUID(),
    status: Status.subscribed,
    email: `${crypto.randomBytes(10).toString('hex')}@test.com`,
  };

  Object.assign(random, partial);

  return random;
};
