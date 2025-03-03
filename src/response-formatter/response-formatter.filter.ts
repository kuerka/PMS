import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class ResponseFormatterFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    console.log(exception);

    const status = exception.getStatus?.() || 500;
    const message = exception.message || 'Internal server error';
    const errorResponse = {
      code: status,
      success: false,
      message,
      data: null,
    };

    response.status(status);
    response.send(errorResponse);
  }
}
