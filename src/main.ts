import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from '@/logger/logger';
import { NestExpressApplication } from '@nestjs/platform-express';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger,
  });
  app.set('trust proxy', true);
  await app.listen(process.env.PORT ?? 4000);
}
void bootstrap();
