import { Test, TestingModule } from '@nestjs/testing';
import * as crypto from 'crypto';
import { Email } from '@prisma/client';
import { getLoggerToken, PinoLogger } from 'nestjs-pino';
import { EmailError } from '../email.error';
import { PrismaDBService } from '../../db/db.servise';
import { EmailService } from '../services/email.service';
import { MetricsService } from '../../metrics/metrics.service';
import { MailerEmailService } from '../services/mailer-email.service';
import { generateRandomEmail } from './utils/generate-random-email.util';
import { Status } from '../enums/email-status.enum';
import { ISendCurrentRate } from '../interfaces/send-current-rate.interface';
import { EMAIL_CONSTANTS } from '../email.constants';

describe('EmailService', () => {
  let logger: PinoLogger;
  let service: EmailService;
  let metricsService: MetricsService;
  let prismaDbService: PrismaDBService;
  let mailerService: MailerEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: PrismaDBService,
          useValue: {
            email: {
              create: jest.fn(),
              update: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: MetricsService,
          useValue: {
            incrementSentEmailsCounter: jest.fn(),
            incrementSubscribtionCounter: jest.fn(),
            incrementUnsubscriptionCounter: jest.fn(),
            incrementSentEmailsErrorCounter: jest.fn(),
          },
        },
        {
          provide: MailerEmailService,
          useValue: {
            send: jest.fn(),
          },
        },
        {
          provide: getLoggerToken(EmailService.name),
          useValue: {
            info: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    logger = module.get<PinoLogger>(getLoggerToken(EmailService.name));
    service = module.get<EmailService>(EmailService);
    metricsService = module.get<MetricsService>(MetricsService);
    prismaDbService = module.get<PrismaDBService>(PrismaDBService);
    mailerService = module.get<MailerEmailService>(MailerEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all emails', async () => {
      const records: Email[] = [];

      for (let i = 0; i < 10; i++) {
        records.push(generateRandomEmail());
      }

      jest.spyOn(prismaDbService.email, 'findMany').mockResolvedValue(records);

      const result = await service.findAll();

      expect(result).toEqual(records);

      expect(prismaDbService.email.findMany).toBeCalledWith();
      expect(prismaDbService.email.findMany).toBeCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create email', async () => {
      const email = crypto.randomBytes(10).toString('hex');
      const record = generateRandomEmail({ email });

      jest.spyOn(prismaDbService.email, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaDbService.email, 'create').mockResolvedValue(record);
      jest
        .spyOn(metricsService, 'incrementSubscribtionCounter')
        .mockResolvedValue();

      const result = await service.create(email);

      expect(result).toEqual(record);

      expect(prismaDbService.email.findUnique).toBeCalledWith({
        where: {
          email,
        },
      });
      expect(prismaDbService.email.findUnique).toBeCalledTimes(1);

      expect(logger.error).toBeCalledTimes(0);

      expect(prismaDbService.email.create).toBeCalledWith({
        data: {
          email,
        },
      });
      expect(prismaDbService.email.create).toBeCalledTimes(1);

      expect(metricsService.incrementSubscribtionCounter).toBeCalled();
      expect(metricsService.incrementSubscribtionCounter).toBeCalledTimes(1);
    });

    it('should throw error if email already exists', async () => {
      const email = crypto.randomBytes(10).toString('hex');
      const record = generateRandomEmail({ email });

      jest.spyOn(prismaDbService.email, 'findUnique').mockResolvedValue(record);

      await expect(service.create(email)).rejects.toThrowError(
        EmailError.AlreadyExists(),
      );

      expect(prismaDbService.email.findUnique).toBeCalledWith({
        where: {
          email,
        },
      });
      expect(prismaDbService.email.findUnique).toBeCalledTimes(1);

      expect(logger.error).toBeCalledWith(`Email ${email} exists`);
      expect(logger.error).toBeCalledTimes(1);

      expect(prismaDbService.email.create).toBeCalledTimes(0);

      expect(metricsService.incrementSubscribtionCounter).toBeCalledTimes(0);
    });
  });

  describe('delete', () => {
    it('should delete email', async () => {
      const email = crypto.randomBytes(10).toString('hex');
      const record = generateRandomEmail({ email });

      jest.spyOn(prismaDbService.email, 'findUnique').mockResolvedValue(record);
      jest.spyOn(prismaDbService.email, 'update').mockResolvedValue(record);
      jest
        .spyOn(metricsService, 'incrementUnsubscriptionCounter')
        .mockResolvedValue();

      const result = await service.delete(email);

      expect(result).toEqual(true);

      expect(prismaDbService.email.findUnique).toBeCalledWith({
        where: {
          email,
        },
      });
      expect(prismaDbService.email.findUnique).toBeCalledTimes(1);

      expect(logger.error).toBeCalledTimes(0);

      expect(prismaDbService.email.update).toBeCalledWith({
        where: {
          email,
        },
        data: {
          deletedAt: expect.any(Date),
          status: Status.unsubscribed,
        },
      });
      expect(prismaDbService.email.update).toBeCalledTimes(1);

      expect(metricsService.incrementUnsubscriptionCounter).toBeCalled();
      expect(metricsService.incrementUnsubscriptionCounter).toBeCalledTimes(1);
    });

    it('should throw error if email not found', async () => {
      const email = crypto.randomBytes(10).toString('hex');

      jest.spyOn(prismaDbService.email, 'findUnique').mockResolvedValue(null);

      await expect(service.delete(email)).rejects.toThrowError(
        EmailError.NotFound(),
      );

      expect(prismaDbService.email.findUnique).toBeCalledWith({
        where: {
          email,
        },
      });
      expect(prismaDbService.email.findUnique).toBeCalledTimes(1);

      expect(logger.error).toBeCalledWith(`Email ${email} not found`);
      expect(logger.error).toBeCalledTimes(1);

      expect(prismaDbService.email.update).toBeCalledTimes(0);

      expect(metricsService.incrementUnsubscriptionCounter).toBeCalledTimes(0);
    });
  });

  describe('sendCurrentRate', () => {
    it('should send current rate', async () => {
      const email = crypto.randomBytes(10).toString('hex');
      const record = generateRandomEmail({ email });
      const payload: ISendCurrentRate = {
        email,
        rate: 2_000_000,
        date: new Date(),
      };
      const html = `\n  <p>Exchange rate is 1 BTC = 2 000 000.00 UAH at ${payload.date.toString()}</p>\n`;

      jest.spyOn(prismaDbService.email, 'findUnique').mockResolvedValue(record);
      jest.spyOn(mailerService, 'send').mockResolvedValue(undefined);
      jest
        .spyOn(metricsService, 'incrementSentEmailsCounter')
        .mockResolvedValue();

      const result = await service.sendCurrentRate(payload);

      expect(result).toEqual(undefined);

      expect(prismaDbService.email.findUnique).toBeCalledWith({
        where: {
          email,
        },
      });
      expect(prismaDbService.email.findUnique).toBeCalledTimes(1);

      expect(logger.error).toBeCalledTimes(0);

      expect(metricsService.incrementSentEmailsCounter).toBeCalled();
      expect(metricsService.incrementSentEmailsCounter).toBeCalledTimes(1);

      expect(mailerService.send).toBeCalledWith({
        to: payload.email,
        subject: EMAIL_CONSTANTS.DEFAULT_SUBJECT,
        message: EMAIL_CONSTANTS.DEFAULT_MESSAGE + html,
      });

      expect(metricsService.incrementSentEmailsErrorCounter).toBeCalledTimes(0);
    });

    it('should throw error if email not found', async () => {
      const email = crypto.randomBytes(10).toString('hex');
      const payload: ISendCurrentRate = {
        email,
        rate: 2_000_000,
        date: new Date(),
      };

      jest.spyOn(prismaDbService.email, 'findUnique').mockResolvedValue(null);

      await expect(service.sendCurrentRate(payload)).rejects.toThrowError(
        EmailError.NotFound(),
      );

      expect(prismaDbService.email.findUnique).toBeCalledWith({
        where: {
          email,
        },
      });
      expect(prismaDbService.email.findUnique).toBeCalledTimes(1);

      expect(logger.error).toBeCalledWith(`Email ${email} not found`);
      expect(logger.error).toBeCalledTimes(1);

      expect(metricsService.incrementSentEmailsCounter).toBeCalledTimes(0);
    });
  });

  it('should have error in email sending', async () => {
    const error = new Error('Email sending error');
    const email = crypto.randomBytes(10).toString('hex');
    const record = generateRandomEmail({ email });
    const payload: ISendCurrentRate = {
      email,
      rate: 2_000_000,
      date: new Date(),
    };
    const html = `\n  <p>Exchange rate is 1 BTC = 2 000 000.00 UAH at ${payload.date.toString()}</p>\n`;

    jest.spyOn(prismaDbService.email, 'findUnique').mockResolvedValue(record);
    jest.spyOn(mailerService, 'send').mockRejectedValue(error);
    jest
      .spyOn(metricsService, 'incrementSentEmailsErrorCounter')
      .mockResolvedValue();

    await expect(service.sendCurrentRate(payload)).rejects.toThrowError(error);

    expect(prismaDbService.email.findUnique).toBeCalledWith({
      where: {
        email,
      },
    });
    expect(prismaDbService.email.findUnique).toBeCalledTimes(1);

    expect(metricsService.incrementSentEmailsCounter).toBeCalledTimes(0);

    expect(mailerService.send).toBeCalledWith({
      to: payload.email,
      subject: EMAIL_CONSTANTS.DEFAULT_SUBJECT,
      message: EMAIL_CONSTANTS.DEFAULT_MESSAGE + html,
    });
    expect(mailerService.send).toBeCalledTimes(1);

    expect(logger.error).toBeCalledWith(
      `Error sending letter to ${payload.email}`,
    );
    expect(logger.error).toBeCalledTimes(1);

    expect(metricsService.incrementSentEmailsErrorCounter).toBeCalledWith();
    expect(metricsService.incrementSentEmailsErrorCounter).toBeCalledTimes(1);
  });
});
