import { Module } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { EmailController } from './email.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerEmailService } from './services/mailer-email.service';
import { DbModule } from 'src/db/db.module';
import { MetricsModule } from 'src/metrics/metrics.module';

@Module({
  exports: [EmailService],
  controllers: [EmailController],
  providers: [EmailService, MailerEmailService],
  imports: [
    DbModule,
    MetricsModule,
    MailerModule.forRoot({
      transport: {
        secure: false,
        host: process.env.SMTP_HOST,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      },
    }),
  ],
})
export class EmailModule {}
