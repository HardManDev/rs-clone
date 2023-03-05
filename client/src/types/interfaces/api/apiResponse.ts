export interface APIResponse {
  map(rawResponse: Response): Promise<this>
}
