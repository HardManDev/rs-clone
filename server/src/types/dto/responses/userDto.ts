import { IUser } from '../../interfaces/user';

export type UserDto = Readonly<Omit<IUser, 'password'>>;
