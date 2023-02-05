import { NestFactory } from '@nestjs/core';
import AppModule from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}

(async (): Promise<void> => {
  await bootstrap();
})();
