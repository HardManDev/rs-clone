import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { AuthValidationMiddleware } from '../../middlewares/authValidation.middleware';
import { AuthController } from '../auth/auth.controller';
import { UserService } from '../user/user.service';
import { User, UserSchema } from '../../models/scheme/user.schema';
import { ScoreModule } from '../score/score.module';
import { CollectionLimitLimitationMiddleware } from '../../middlewares/collectionLimitLimitation.middleware';
import { LeaderboardModule } from '../leaderboard/leaderboard.module';

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
    LeaderboardModule,
  ],
  providers: [UserService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CollectionLimitLimitationMiddleware).forRoutes('*');
    consumer.apply(AuthValidationMiddleware).forRoutes(AuthController);
  }
}
