import { APIResponse } from '../../../../types/interfaces/api/apiResponse';
import MappingFailedError from '../../../errors/mappingFailedError';

export default class GetScoreResponse implements APIResponse {
  totalCount?: number;

  scores: Array<{
    id?: string
    user?: string
    score?: number
    createdAt?: Date
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
            user: score.user,
            score: score.score,
            createdAt: new Date(Date.parse(score.createdAt)),
          });
        });
      }

      return this;
    } catch (e: unknown) {
      throw new MappingFailedError(Response, GetScoreResponse);
    }
  }
}
