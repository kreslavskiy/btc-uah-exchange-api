import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EmailFilter } from './email/filters/email.exception-filter';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useGlobalFilters(new EmailFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useLogger(app.get(Logger));

  await app.listen(3000);
}
bootstrap();
