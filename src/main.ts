import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from '@/logger/logger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger });
  await app.listen(process.env.PORT ?? 4000);
}
void bootstrap();
