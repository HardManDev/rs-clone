import { APIRequest } from './apiRequest';
import { APIResponse } from './apiResponse';

export interface IAPIController {
  fetch<TResponse extends APIResponse>(
    request: APIRequest<TResponse>
  ): Promise<TResponse>
}
