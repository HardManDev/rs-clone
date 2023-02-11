import { Injectable } from '@nestjs/common';
import { User } from '../models/scheme/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from '../types/interfaces/user';
import { UserNotFoundError } from '../errors/userNotFoundError';
import { UserAlreadyExists } from '../errors/userAlreadyExists';
import { AuthProvider } from '../types/enums/authProviders';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findAll(page: number, limit: number): Promise<IUser[]> {
    const startIndex = (page - 1) * (limit <= 100 ? limit : 100);
    return this.userModel.find({}).skip(startIndex).limit(limit).exec();
  }

  async findOne(id: IUser['_id']): Promise<IUser | never> {
    const result = await this.userModel.findOne({ _id: id }).exec();

    if (!result) {
      throw new UserNotFoundError(id);
    }

    return result;
  }

  async create(user: Omit<IUser, '_id'>): Promise<IUser> {
    await this.validateUser(user);

    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async update(
    id: IUser['_id'],
    newUser: Omit<IUser, '_id'>,
  ): Promise<IUser | null> {
    const targetUser = await this.userModel.findOne({ _id: id }).exec();

    if (!targetUser) {
      throw new UserNotFoundError(id);
    }

    await this.validateUser(newUser);

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

    return targetUser;
  }

  async delete(id: IUser['_id']): Promise<IUser | null> {
    const targetUser = await this.userModel.findOne({ _id: id }).exec();

    if (!targetUser) {
      throw new UserNotFoundError(id);
    }

    await targetUser.remove();
    await targetUser.save();

    return targetUser;
  }

  private async validateUser(user: Omit<IUser, '_id'>): Promise<void | never> {
    if (user.username.trim().length < 3) {
      throw new Error('The username must be more than 3 characters.');
    }

    if (!(user.authProvider === AuthProvider.LOCAL)) {
      throw new Error('Invalid auth provider.');
    }

    const duplicate = await this.userModel
      .findOne({
        username: user.username,
        authProvider: user.authProvider,
      })
      .exec();

    if (duplicate) {
      throw new UserAlreadyExists(user.username, user.authProvider);
    }
  }
}
