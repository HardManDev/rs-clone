import { IUser } from './user';
import { Ref } from '@typegoose/typegoose';

export interface IScore {
  readonly _id: string;
  readonly score: number;
  readonly user: Ref<IUser>;
}
