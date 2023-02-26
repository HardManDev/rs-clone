export type UserScore = {
  id?: string
  score?: number
  createdAt?: Date
  user?: {
    id?: string
    username?: string
    authProvider?: string
  }
};
