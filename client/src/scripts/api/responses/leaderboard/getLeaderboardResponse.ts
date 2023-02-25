import { APIResponse } from '../../../../types/interfaces/api/apiResponse';
import MappingFailedError from '../../../errors/mappingFailedError';

export default class GetLeaderboardResponse implements APIResponse {
  totalCount?: number;

  scores: Array<{
    id?: string
    score?: number
    createdAt?: Date
    user?: {
      id?: string
      username?: string
      authProvider?: string
    }
  }> = [];

  async map(rawResponse: Response): Promise<this> {
    try {
      const json = await rawResponse.json();

      this.totalCount = Number(rawResponse.headers.get('X-Total-Count'));

      if (Array.isArray(json)) {
        json.forEach((score) => {
          this.scores.push({
            // eslint-disable-next-line no-underscore-dangle
            id: score._id,
            score: score.score,
            createdAt: new Date(Date.parse(score.createdAt)),
            user: {
              // eslint-disable-next-line no-underscore-dangle
              id: score.user._id,
              username: score.user.username,
              authProvider: score.user.authProvider,
            },
          });
        });
      }

      return this;
    } catch (e: unknown) {
      throw new MappingFailedError(Response, GetLeaderboardResponse);
    }
  }
}
