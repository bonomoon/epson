export interface ScoreFile {
  name: string;
  type: string;
  url: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  subject_id: string;
}

export type Status = 0 | 1 | 2;
