/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

export class FailedCause {
  cause: string = 'Failed';
  constructor(cause: string) {
    this.cause = cause;
  }
}

@Injectable()
export class ResponseFormatterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof FailedCause) {
          return { success: false, code: 0, cause: data.cause };
        } else {
          return { success: true, code: 0, data };
        }
      }),
    );
  }
}
