import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { AuthValidationMiddleware } from '../../middlewares/authValidation.middleware';
import { AuthController } from '../auth/auth.controller';
import { UserService } from '../user/user.service';
import { User, UserSchema } from '../../models/scheme/user.schema';
import { ScoreModule } from '../score/score.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_CONNECTION_URL ||
        'mongodb://127.0.0.1:27017/rs-clone',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    ),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UserModule,
    AuthModule,
    ScoreModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthValidationMiddleware).forRoutes(AuthController);
  }
}
