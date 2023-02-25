import { APIResponse } from '../../../../types/interfaces/api/apiResponse';
import MappingFailedError from '../../../errors/mappingFailedError';

export default class AuthUserLocalResponse implements APIResponse {
  id?: string;

  username?: string;

  authProvider?: string;

  accessToken?: string;

  async map(rawResponse: Response): Promise<this> {
    try {
      const res = await rawResponse.json();

      // eslint-disable-next-line no-underscore-dangle
      this.id = res._id;
      this.username = res.username;
      this.authProvider = res.authProvider;
      this.accessToken = res.accessToken;

      return this;
    } catch (e: unknown) {
      throw new MappingFailedError(Response, AuthUserLocalResponse);
    }
  }
}
