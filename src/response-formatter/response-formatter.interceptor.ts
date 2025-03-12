/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { handleRequestLogger } from '@/logger/logger';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { map, Observable } from 'rxjs';

export class FailedCause {
  cause: string = 'Failed';
  constructor(cause: string) {
    this.cause = cause;
  }
}

@Injectable()
export class ResponseFormatterInterceptor implements NestInterceptor {
  private readonly logger = new Logger();
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    return next.handle().pipe(
      map((data) => {
        handleRequestLogger(this.logger, request);
        if (data instanceof FailedCause) {
          return { success: false, code: 0, cause: data.cause };
        } else {
          return { success: true, code: 0, data };
        }
      }),
    );
  }
}
