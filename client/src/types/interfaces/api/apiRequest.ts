import HTTPMethod from '../../enums/httpMethods';
import { APIResponse } from './apiResponse';

export interface APIRequest<TResponse extends APIResponse> {
  method: HTTPMethod
  endpoint: string
  headers?: Headers
  queryParams?: {
    [key: string]: string
  }
  body?: {
    [key: string]: string | number | boolean | object | null | undefined
  }
  response: new () => TResponse
}
