import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:8080', '*', (process.env.FRONT_END_URL || '*')],
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
}

(async (): Promise<void> => {
  await bootstrap();
})();
