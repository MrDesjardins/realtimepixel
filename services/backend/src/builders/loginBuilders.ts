import {
  UserLoginResponse,
  CreateUserResponse,
  RefreshTokenResponse,
} from "@shared/models/login";

export function buildLoginUserResponse(
  userEmail: string,
  accessToken: string,
  refreshToken: string
): UserLoginResponse {
  return {
    email: userEmail,
    timestamp: Date.now(),
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
}

export function buildCreateUserResponse(
  userEmail: string,
  accessToken: string,
  refreshToken: string
): CreateUserResponse {
  return {
    email: userEmail,
    timestamp: Date.now(),
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
}
export function buildRefreshTokensResponse(
  accessToken: string,
  refreshToken: string
): RefreshTokenResponse {
  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
}
