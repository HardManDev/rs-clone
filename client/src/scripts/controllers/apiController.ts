import { IAPIController } from '../../types/interfaces/api/apiController';
import { APIRequest } from '../../types/interfaces/api/apiRequest';
import { APIResponse } from '../../types/interfaces/api/apiResponse';

class APIController implements IAPIController {
  constructor(
    private readonly baseURL: string = 'http://localhost:3000',
  ) {
  }

  fetch<TResponse extends APIResponse>(
    request: APIRequest<TResponse>,
  ): Promise<TResponse> {
    return new Promise<TResponse>((resolve, reject) => {
      const url = new URL(request.endpoint, this.baseURL);
      const headers = new Headers(request.headers);

      if (request.queryParams) {
        Object.entries(request.queryParams)
          .forEach(([key, value]) => {
            url.searchParams.append(key, value.toString());
          });
      }

      headers.append('Content-Type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');

      fetch(url.href, {
        method: request.method,
        headers,
        body: request.body ? JSON.stringify(request.body) : undefined,
        credentials: 'include',
      })
        .then(async (rawResponse) => {
          if (!rawResponse.ok) {
            const body = await rawResponse.json();
            reject(body);
          }

          // eslint-disable-next-line new-cap
          const response = new request.response();
          await response.map(rawResponse);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  }
}

const api = new APIController(process.env.API_URL);
export default api;
