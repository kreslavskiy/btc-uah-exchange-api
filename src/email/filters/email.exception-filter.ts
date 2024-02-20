import { ArgumentsHost, Catch } from '@nestjs/common';
import { error } from 'console';
import { Response } from 'express';

@Catch()
export class EmailFilter {
  public catch(exception: Error, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    switch (exception.name) {
      case 'EMAIL_ALREADY_EXISTS':
        response.status(409).send({
          error: exception.message,
          statusCode: 409,
        });
        break;

      case 'EMAIL_NOT_FOUND':
        response.status(404).send({
          error: exception.message,
          statusCode: 404,
        });
        break;

      default:
        response.status(500).send({
          error: exception.message,
          statusCode: 500,
        });
    }
  }
}