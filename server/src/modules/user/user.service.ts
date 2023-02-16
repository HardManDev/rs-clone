import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../../models/scheme/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from '../../types/interfaces/user';
import { UserNotFoundError } from '../../errors/userNotFoundError';
import { UserAlreadyExists } from '../../errors/userAlreadyExists';
import { AuthProvider } from '../../types/enums/authProviders';
import { CreateUserRequestDto } from '../../types/dto/user/createUserDto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async find(filter: object): Promise<IUser> {
    const result = await this.userModel.findOne(filter).exec();

    if (!result) {
      throw new UserNotFoundError(filter);
    }

    return result;
  }

  async findByUserNameAndAuthProvider(
    username: IUser['username'],
    authProvider: IUser['authProvider'],
  ): Promise<IUser> {
    const result = await this.userModel
      .findOne({ username, authProvider })
      .exec();

    if (!result) {
      throw new UserNotFoundError({
        username,
        authProvider,
      });
    }

    return result;
  }

  async create(user: CreateUserRequestDto): Promise<IUser> {
    await this.validateUser(user);

    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  private async validateUser(
    user: CreateUserRequestDto,
    skipDuplicateCheck = false,
  ): Promise<void> {
    let duplicate = false;

    if (user.username.trim().length < 3) {
      throw new BadRequestException(
        'The username must be more than 3 characters.',
      );
    }

    if (!(user.authProvider === AuthProvider.LOCAL)) {
      throw new BadRequestException('Invalid auth provider.');
    }

    if (!skipDuplicateCheck) {
      const existUser = await this.userModel
        .findOne({
          username: user.username,
          authProvider: user.authProvider,
        })
        .exec();

      duplicate = !!existUser;
    }

    if (duplicate) {
      throw new UserAlreadyExists(user.username, user.authProvider);
    }
  }
}
