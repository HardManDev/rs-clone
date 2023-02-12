import { IUser } from '../types/interfaces/user';
import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundError extends HttpException {
  constructor(user: Partial<IUser>) {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message:
          'The requested user was not found or does not exist in the current authorization provider.',
        error: 'Not Found',
        errorData: {
          user: {
            id: user._id,
            username: user.username,
            authProvider: user.authProvider,
          },
        },
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
