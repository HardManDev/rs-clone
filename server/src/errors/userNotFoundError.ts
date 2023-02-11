import { IUser } from '../types/interfaces/user';

export class UserNotFoundError extends Error {
  constructor(userId: IUser['_id']) {
    super(`User with id: '${userId}' not found.`);
  }
}
