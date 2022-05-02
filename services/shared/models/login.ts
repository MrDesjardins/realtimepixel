import { Token } from "./primitive";
export interface TokenResponse {
  accessToken: Token;
  refreshToken: Token;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserLoginResponse extends TokenResponse {
  email: string;

  timestamp: number;
}

export interface CreateUserRequest {
  email: string;
  password: string;
}

export interface CreateUserResponse extends TokenResponse {
  email: string;
  timestamp: number;
}

export interface RefreshTokenRequest {
  email: string;
  refreshToken: string;
}

export interface RefreshTokenResponse extends TokenResponse {}

export interface LogoutRequest {}
export interface LogoutResponse {}
