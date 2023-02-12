import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as UUIDv4 } from 'uuid';
import { IUser } from '../../types/interfaces/user';
import { AuthProvider } from '../../types/enums/authProviders';

@Schema({ collection: 'users' })
export class User extends Document implements IUser {
  @Prop({
    type: String,
    isRequired: true,
    default: UUIDv4,
  })
  _id: string;

  @Prop({
    type: String,
    isRequired: true,
  })
  username: string;

  @Prop({
    type: String,
    isRequired: false,
  })
  password?: string;

  @Prop({
    type: String,
    isRequired: true,
  })
  authProvider: AuthProvider;

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
