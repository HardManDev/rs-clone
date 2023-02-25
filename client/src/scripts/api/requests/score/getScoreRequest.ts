import BaseAPIRequest from '../baseAPIRequest';
import GetScoreResponse from '../../responses/score/getScoreResponse';
import HTTPMethod from '../../../../types/enums/httpMethods';

export default class GetScoreRequest extends BaseAPIRequest<GetScoreResponse> {
  constructor(page = 1, limit = 100, sortBy: 'asc' | 'desc' = 'desc') {
    super(
      HTTPMethod.GET,
      '/score',
      GetScoreResponse,
      new Headers(),
      {
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
      },
    );
  }
}
