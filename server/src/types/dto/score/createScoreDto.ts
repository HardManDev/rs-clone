import { IScore } from '../../interfaces/score';
import { IUser } from '../../interfaces/user';

export type CreateScoreRequestDto = Omit<IScore, 'user'> & {
  user: IUser;
};
export type CreateScoreResponseDto = Omit<IScore, 'user'> & {
  user: Pick<IUser, '_id' | 'username' | 'authProvider'>;
};
