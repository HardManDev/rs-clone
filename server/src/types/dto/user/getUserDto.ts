import { IUser } from '../../interfaces/user';

export type UserInfoDto = Pick<
  IUser,
  '_id' | 'username' | 'authProvider' | 'createdAt'
>;
