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

export type Score = {
  id?: string
  score?: number
  createdAt?: Date
  user?: string
};
