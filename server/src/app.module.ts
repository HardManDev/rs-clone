import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_CONNECTION_URL || 'mongodb://127.0.0.1:27017',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
