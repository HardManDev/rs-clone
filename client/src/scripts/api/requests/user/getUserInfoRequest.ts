import BaseAPIRequest from '../baseAPIRequest';
import GetUserInfoResponse from '../../responses/user/getUserInfoResponse';
import HTTPMethod from '../../../../types/enums/httpMethods';

export default class GetUserInfoRequest
  extends BaseAPIRequest<GetUserInfoResponse> {
  constructor() {
    super(
      HTTPMethod.GET,
      '/user',
      GetUserInfoResponse,
    );
  }
}
