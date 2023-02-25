import { APIResponse } from '../../../../types/interfaces/api/apiResponse';
import MappingFailedError from '../../../errors/mappingFailedError';

export default class CreateScoreResponse implements APIResponse {
  id?: string;

  score?: number;

  createdAt?: Date;

  user?: {
    id?: string
    username?: string
    authProvider?: string
  };

  async map(rawResponse: Response): Promise<this> {
    try {
      const json = await rawResponse.json();

      // eslint-disable-next-line no-underscore-dangle
      this.id = json._id;
      this.score = json.score;
      this.createdAt = new Date(Date.parse(json.createdAt));
      this.user = {
        // eslint-disable-next-line no-underscore-dangle
        id: json.user._id,
        username: json.user.username,
        authProvider: json.user.authProvider,
      };

      return this;
    } catch (e: unknown) {
      throw new MappingFailedError(Response, CreateScoreResponse);
    }
  }
}
