import { INestApplication, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

export class PrismaDBService extends PrismaClient implements OnModuleInit {
  constructor(
    @InjectPinoLogger(PrismaDBService.name) private readonly logger: PinoLogger,
  ) {
    super();
  }

  public async onModuleInit(): Promise<void> {
    try {
      await this.$connect();

      this.logger.info('Connected to the database');
    } catch (error) {
      this.logger.fatal('Failed to connect to the database');

      process.exit(1);
    }
  }

  public async enableShutdownHooks(app: INestApplication): Promise<void> {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}
