import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../../models/scheme/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from '../../types/interfaces/user';
import { UserNotFoundError } from '../../errors/userNotFoundError';
import { UserAlreadyExists } from '../../errors/userAlreadyExists';
import { AuthProvider } from '../../types/enums/authProviders';
import { CreateUserRequestDto } from '../../types/dto/user/createUserDto';
import { UpdateUserRequestDto } from '../../types/dto/user/updateUserDto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findAll(page: number, limit: number): Promise<IUser[]> {
    const startIndex = (page - 1) * (limit <= 100 ? limit : 100);
    return this.userModel.find({}).skip(startIndex).limit(limit).exec();
  }

  async findOne(id: IUser['_id']): Promise<IUser> {
    const result = await this.userModel.findOne({ _id: id }).exec();

    if (!result) {
      throw new UserNotFoundError({
        _id: id,
      });
    }

    return result;
  }

  async create(user: CreateUserRequestDto): Promise<IUser> {
    await this.validateUser(user);

    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async update(
    id: IUser['_id'],
    newUser: UpdateUserRequestDto,
  ): Promise<IUser> {
    const targetUser = await this.userModel.findOne({ _id: id }).exec();

    if (!targetUser) {
      throw new UserNotFoundError({
        _id: id,
        ...newUser,
      });
    }

    await this.validateUser(newUser, true);

    await targetUser
      .update(
        {
          _id: id,
          ...newUser,
        },
        { new: true },
      )
      .exec();
    await targetUser.save();

    return {
      _id: id,
      ...newUser,
    };
  }

  async delete(id: IUser['_id']): Promise<IUser> {
    const targetUser = await this.userModel.findOne({ _id: id }).exec();

    if (!targetUser) {
      throw new UserNotFoundError({
        _id: id,
      });
    }

    await targetUser.remove();

    return targetUser;
  }

  private async validateUser(
    user: CreateUserRequestDto | UpdateUserRequestDto,
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
