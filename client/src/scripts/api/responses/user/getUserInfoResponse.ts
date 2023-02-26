import { APIResponse } from '../../../../types/interfaces/api/apiResponse';
import MappingFailedError from '../../../errors/mappingFailedError';

export default class GetUserInfoResponse implements APIResponse {
  id?: string;

  username?: string;

  authProvider?: string;

  createdAt?: Date;

  async map(rawResponse: Response): Promise<this> {
    try {
      const json = await rawResponse.json();

      // eslint-disable-next-line no-underscore-dangle
      this.id = json._id;
      this.username = json.username;
      this.authProvider = json.authProvider;
      this.createdAt = new Date(Date.parse(json.createdAt));

      return this;
    } catch (e: unknown) {
      throw new MappingFailedError(Response, GetUserInfoResponse);
    }
  }
}
