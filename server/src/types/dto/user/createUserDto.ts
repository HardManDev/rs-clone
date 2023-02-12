import { IUser } from '../../interfaces/user';

export type CreateUserRequestDto = Pick<
  IUser,
  'username' | 'password' | 'authProvider'
>;
