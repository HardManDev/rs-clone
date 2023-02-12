import { IUser } from '../../interfaces/user';

export type CreateUserRequestDto = Omit<IUser, '_id'>;
