import { ArgumentsHost, Catch } from '@nestjs/common';
import { Response } from 'express';
import { PinoLogger } from 'nestjs-pino';

@Catch()
export class EmailFilter {
  private readonly logger: PinoLogger = new PinoLogger({});

  public catch(exception: Error, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    switch (exception.name) {
      case 'EMAIL_ALREADY_EXISTS':
        response.status(409).send({
          statusCode: 409,
          error: exception.message,
        });
        break;

      case 'EMAIL_NOT_FOUND':
        response.status(404).send({
          statusCode: 404,
          error: exception.message,
        });
        break;

      default:
        response.status(500).send({
          statusCode: 500,
          error: exception.message,
        });

        this.logger.error(exception.message, exception.stack);
    }
  }
}
