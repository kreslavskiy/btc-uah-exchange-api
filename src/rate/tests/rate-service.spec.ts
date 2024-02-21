import { Test, TestingModule } from '@nestjs/testing';
import * as crypto from 'crypto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../../email/services/email.service';
import { MetricsService } from '../../metrics/metrics.service';
import { RateService } from '../rate.service';

describe('RateService', () => {
  let service: RateService;
  let emailService: EmailService;

  beforeAll(() => {
    jest.useFakeTimers({ now: new Date() });
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RateService,
        {
          provide: MetricsService,
          useValue: {
            setRate: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendCurrentRate: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RateService>(RateService);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendCurrentRateEmail', () => {
    it('should send an email with the current rate', async () => {
      const emails = [
        crypto.randomBytes(20).toString('hex'),
        crypto.randomBytes(20).toString('hex'),
      ];
      const message = crypto.randomBytes(20).toString('hex');

      jest.spyOn(service, 'getExchangeRate').mockResolvedValue({
        rate: 2_000_000,
        date: new Date().toISOString(),
      });
      for (let i = 0; i < emails.length; i++) {
        jest
          .spyOn(emailService, 'sendCurrentRate')
          .mockResolvedValueOnce(undefined);
      }

      const result = await service.sendCurrentRateEmail(emails, message);

      expect(result).toBe(true);

      expect(service.getExchangeRate).toBeCalledWith();
      expect(service.getExchangeRate).toBeCalledTimes(1);

      for (let i = 0; i < emails.length; i++) {
        expect(emailService.sendCurrentRate).toBeCalledWith({
          message,
          rate: 2_000_000,
          email: emails[i],
          date: new Date(),
        });
      }
      expect(emailService.sendCurrentRate).toBeCalledTimes(emails.length);
    });
  });
});
