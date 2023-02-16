import { AuthProvider } from '../enums/authProviders';
import { Types } from 'mongoose';

export interface IUser {
  readonly _id: string;
  readonly username: string;
  readonly password?: string;
  readonly authProvider: AuthProvider;
  readonly scores?: Array<Types.ObjectId>;
  readonly createdAt?: Date;
}
