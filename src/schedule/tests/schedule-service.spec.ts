import { Test, TestingModule } from '@nestjs/testing';
import { Email } from '@prisma/client';
import { ScheduleService } from '../schedule.service';
import { RateService } from '../../rate/rate.service';
import { SCHEDULE_CONSTANTS } from '../schedule.constants';
import { MetricsService } from '../../metrics/metrics.service';
import { EmailService } from '../../email/services/email.service';
import { generateRandomEmail } from '../../email/tests/utils/generate-random-email.util';
import { Status } from '../../email/enums/email-status.enum';

describe('ScheduleService', () => {
  let service: ScheduleService;
  let rateService: RateService;
  let emailService: EmailService;
  let metricsService: MetricsService;

  beforeAll(() => {
    jest.useFakeTimers({ now: new Date() });
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleService,
        {
          provide: EmailService,
          useValue: {
            findAll: jest.fn(),
            sendCurrentRate: jest.fn(),
          },
        },
        {
          provide: MetricsService,
          useValue: {
            getLastSentRate: jest.fn(),
            setLastSentRate: jest.fn(),
          },
        },
        {
          provide: RateService,
          useValue: {
            getExchangeRate: jest.fn(),
          },
        },
      ],
    }).compile();

    rateService = module.get<RateService>(RateService);
    emailService = module.get<EmailService>(EmailService);
    service = module.get<ScheduleService>(ScheduleService);
    metricsService = module.get<MetricsService>(MetricsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendChangeRateEmail', () => {
    it('should send an email with the current rate', async () => {
      const rateResult = {
        rate: 100,
        date: new Date().toISOString(),
      };
      const emails: Email[] = [
        generateRandomEmail(),
        generateRandomEmail(),
        generateRandomEmail(),
      ];

      jest.spyOn(rateService, 'getExchangeRate').mockResolvedValue(rateResult);
      jest.spyOn(metricsService, 'getLastSentRate').mockResolvedValue(80);
      jest.spyOn(emailService, 'findAll').mockResolvedValue(emails);
      jest
        .spyOn(metricsService, 'setLastSentRate')
        .mockResolvedValue(undefined);
      for (let i = 0; i < emails.length; i++) {
        jest
          .spyOn(emailService, 'sendCurrentRate')
          .mockResolvedValueOnce(undefined);
      }

      const result = await service.sendChangeRateEmail();

      expect(rateService.getExchangeRate).toBeCalledWith();
      expect(metricsService.getLastSentRate).toBeCalledTimes(1);

      expect(metricsService.getLastSentRate).toBeCalledWith();
      expect(metricsService.getLastSentRate).toBeCalledTimes(1);

      expect(emailService.findAll).toBeCalledWith(Status.subscribed);
      expect(emailService.findAll).toBeCalledTimes(1);

      expect(metricsService.setLastSentRate).toBeCalledWith(rateResult.rate);
      expect(metricsService.setLastSentRate).toBeCalledTimes(1);

      for (const record of emails) {
        expect(emailService.sendCurrentRate).toBeCalledWith({
          rate: 100,
          email: record.email,
          date: new Date(rateResult.date),
          message: SCHEDULE_CONSTANTS.MESSAGE.SIGNIFICANT_RATE_CHANGE,
        });
      }
      expect(emailService.sendCurrentRate).toBeCalledTimes(emails.length);

      expect(result).toBe(undefined);
    });
  });

  describe('sendCurrentRateEmail', () => {
    it('should send an email with the current rate', async () => {
      const rateResult = {
        rate: 100,
        date: new Date().toISOString(),
      };
      const emails: Email[] = [
        generateRandomEmail(),
        generateRandomEmail(),
        generateRandomEmail(),
      ];

      jest.spyOn(rateService, 'getExchangeRate').mockResolvedValue(rateResult);
      jest.spyOn(emailService, 'findAll').mockResolvedValue(emails);
      for (let i = 0; i < emails.length; i++) {
        jest
          .spyOn(emailService, 'sendCurrentRate')
          .mockResolvedValueOnce(undefined);
      }

      const result = await service.sendCurrentRateEmail();

      expect(rateService.getExchangeRate).toBeCalledWith();
      expect(rateService.getExchangeRate).toBeCalledTimes(1);

      expect(emailService.findAll).toBeCalledWith(Status.subscribed);
      expect(emailService.findAll).toBeCalledTimes(1);

      for (const record of emails) {
        expect(emailService.sendCurrentRate).toBeCalledWith({
          rate: 100,
          email: record.email,
          date: new Date(rateResult.date),
          message: SCHEDULE_CONSTANTS.MESSAGE.EVERY_DAY_9_30_AM,
        });
      }
      expect(emailService.sendCurrentRate).toBeCalledTimes(emails.length);

      expect(result).toBe(undefined);
    });
  });
});
