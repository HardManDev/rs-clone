import { IUser } from '../types/interfaces/user';

export class UserAlreadyExists extends Error {
  constructor(
    username: IUser['username'],
    authProvider: IUser['authProvider'],
  ) {
    super(
      `User with username: '${username}' and auth provider: '${authProvider}' already exists.`,
    );
  }
}
