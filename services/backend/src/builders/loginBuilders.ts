import {
  UserLoginResponse,
  CreateUserResponse,
  RefreshTokenResponse,
} from "@shared/models/login";
import { BaseJsonResponse } from "@shared/models/response";
import { HTTP_STATUS } from "@shared/constants/backend";

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

export function buildSuccessfulResponse(message: string): BaseJsonResponse {
  return {
    status: HTTP_STATUS.ok,
    message: message,
  };
}
