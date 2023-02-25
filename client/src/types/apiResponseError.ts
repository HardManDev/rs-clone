export type APIResponseError = Error | {
  statusCode: number,
  message: string,
  error: string
  [key: string]: string | number | boolean | object | undefined | null
};
