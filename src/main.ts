import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from '@/logger/logger';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger });
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 4000);
}
void bootstrap();
