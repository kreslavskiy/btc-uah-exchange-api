import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { CreateEmailSchema } from './schemas/create-email.schema';
import { EmailModelResponse } from './responses/email-model.response';
import { DeleteEmailResponse } from './responses/delete-email.response';
import { EmailModelsResponse } from './responses/email-models.response';

@Controller('api/email/subscription')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get()
  public async findAll(): Promise<EmailModelsResponse> {
    const emails = await this.emailService.findAll();

    return new EmailModelsResponse(emails);
  }

  @Post()
  public async create(
    @Body() body: CreateEmailSchema,
  ): Promise<EmailModelResponse> {
    const email = await this.emailService.create(body.email);

    return new EmailModelResponse(email);
  }

  @Delete()
  public async delete(
    @Body() body: CreateEmailSchema,
  ): Promise<DeleteEmailResponse> {
    const deleted = await this.emailService.delete(body.email);

    return new DeleteEmailResponse(deleted);
  }
}
