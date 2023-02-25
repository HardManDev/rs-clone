import BaseAPIRequest from '../baseAPIRequest';
import CreateScoreResponse from '../../responses/score/createScoreResponse';
import HTTPMethod from '../../../../types/enums/httpMethods';

export default class CreateScoreRequest
  extends BaseAPIRequest<CreateScoreResponse> {
  constructor(score: number) {
    super(
      HTTPMethod.POST,
      '/score',
      CreateScoreResponse,
      new Headers(),
      {},
      {
        score,
      },
    );
  }
}
