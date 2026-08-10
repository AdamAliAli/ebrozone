export type Role = "STUDENT" | "TEACHER" | "ADMINISTRATOR";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface SessionUser {
  id: string;
  role: Role;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface ForgotPasswordRequestBody {
  email: string;
}
