import { IUser } from '../../interfaces/user';

export type LoginUserRequestDto = Pick<IUser, 'username' | 'password'>;
export type RegisterUserRequestDto = LoginUserRequestDto;

export type LoginUserResponseDto = {
  accessToken: string;
} & Pick<IUser, '_id' | 'username' | 'password' | 'authProvider'>;
export type RegisterUserResponseDto = LoginUserResponseDto;
