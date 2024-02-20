import { Module } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { EmailController } from './email.controller';
import { PrismaService } from './services/prisma.servise';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerEmailService } from './services/mailer-email.service';

@Module({
  exports: [EmailService],
  controllers: [EmailController],
  providers: [EmailService, PrismaService, MailerEmailService],
  imports: [
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
