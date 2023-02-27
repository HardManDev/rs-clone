import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  console.log(`CORS: ${process.env.FRONT_END_URL || 'http://localhost:8080'}`);
  app.use(cookieParser());
  app.enableCors({
    origin: [process.env.FRONT_END_URL || 'http://localhost:8080'],
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
}

(async (): Promise<void> => {
  await bootstrap();
})();
