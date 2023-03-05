import { APIRequest } from '../../../types/interfaces/api/apiRequest';
import HTTPMethod from '../../../types/enums/httpMethods';
import { APIResponse } from '../../../types/interfaces/api/apiResponse';

export default abstract class BaseAPIRequest<TResponse extends APIResponse>
implements APIRequest<TResponse> {
  protected constructor(
    readonly method: HTTPMethod,
    readonly endpoint: string,
    readonly response: new () => TResponse,
    readonly headers?: Headers,
    readonly queryParams?: {
      [key: string]: string
    },
    readonly body?: {
      [key: string]: string | number | boolean | object | null | undefined
    },
  ) {
  }
}
