import { IUser } from '../types/interfaces/user';
import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExists extends HttpException {
  constructor(
    username: IUser['username'],
    authProvider: IUser['authProvider'],
  ) {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        message: 'This user already exists in current authorization provider.',
        user: {
          username,
          authProvider,
        },
      },
      HttpStatus.CONFLICT,
    );
  }
}
