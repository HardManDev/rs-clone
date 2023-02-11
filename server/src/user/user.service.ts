import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../models/scheme/user.schema';
import { CreateUserRequestDto } from '../types/dto/requests/createUserRequestDto';
import { UserDto } from '../types/dto/responses/userDto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findAll(): Promise<UserDto[]> {
    return await this.userModel.find().exec();
  }

  async findOne(id: string): Promise<UserDto | null> {
    return await this.userModel.findOne({ _id: id }).exec();
  }

  async create(requestDto: CreateUserRequestDto): Promise<UserDto> {
    const newUser = new this.userModel(requestDto);
    return await newUser.save();
  }

  async update(
    id: string,
    user: CreateUserRequestDto,
  ): Promise<UserDto | null> {
    return this.userModel.findByIdAndUpdate(id, user, { new: true });
  }

  async delete(id: string): Promise<UserDto | null> {
    return this.userModel.findByIdAndDelete(id);
  }
}
