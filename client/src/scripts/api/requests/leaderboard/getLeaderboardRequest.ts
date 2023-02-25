import BaseAPIRequest from '../baseAPIRequest';
import GetLeaderboardResponse
  from '../../responses/leaderboard/getLeaderboardResponse';
import HTTPMethod from '../../../../types/enums/httpMethods';

export default class GetLeaderboardRequest
  extends BaseAPIRequest<GetLeaderboardResponse> {
  constructor(page = 1, limit = 100, sortBy: 'asc' | 'desc' = 'desc') {
    super(
      HTTPMethod.GET,
      '/leaderboard',
      GetLeaderboardResponse,
      new Headers(),
      {
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
      },
    );
  }
}
