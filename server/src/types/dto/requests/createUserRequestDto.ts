import { IUser } from '../../interfaces/user';

export type CreateUserRequestDto = Readonly<Omit<IUser, '_id'>>;
