import BaseAPIRequest from '../baseAPIRequest';
import HTTPMethod from '../../../../types/enums/httpMethods';
import AuthUserLocalResponse from '../../responses/auth/authUserLocalResponse';

export default class AuthUserLocalRequest
  extends BaseAPIRequest<AuthUserLocalResponse> {
  constructor(
    username: string,
    password: string,
    action: 'login' | 'register',
  ) {
    super(
      HTTPMethod.POST,
      `/auth/${action}`,
      AuthUserLocalResponse,
      new Headers(),
      {
        provider: 'local',
      },
      {
        username,
        password,
      },
    );
  }
}
