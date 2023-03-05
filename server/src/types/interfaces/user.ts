import { AuthProvider } from '../enums/authProviders';

export interface IUser {
  readonly _id: string;
  readonly username: string;
  readonly password?: string;
  readonly authProvider: AuthProvider;
  readonly createdAt?: Date;
}
