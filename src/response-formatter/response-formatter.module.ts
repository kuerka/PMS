import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseFormatterInterceptor } from './response-formatter.interceptor';
import { ResponseFormatterFilter } from './response-formatter.filter';

@Module({
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ResponseFormatterInterceptor },
    { provide: APP_FILTER, useClass: ResponseFormatterFilter },
  ],
})
export class ResponseFormatterModule {}
