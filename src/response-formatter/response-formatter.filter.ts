import { handleRequestLogger } from '@/logger/logger';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class ResponseFormatterFilter implements ExceptionFilter {
  private readonly logger = new Logger();
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request: Request = ctx.getRequest();
    const response: Response = ctx.getResponse();

    console.log(exception);

    const status = exception.getStatus?.() || 500;
    const message = exception.message || 'Internal server error';
    const errorResponse = {
      code: status,
      success: false,
      message,
      error: exception,
      data: null,
    };

    handleRequestLogger(this.logger, request, status);

    response.status(status);
    response.send(errorResponse);
  }
}
