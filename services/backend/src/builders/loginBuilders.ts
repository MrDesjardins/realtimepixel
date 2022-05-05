import {
  UserLoginResponse,
  CreateUserResponse,
  RefreshTokenResponse,
} from "@shared/models/login";
import { BaseJsonResponse } from "@shared/models/response";
import { HTTP_STATUS } from "@shared/constants/backend";
import { Id } from "../../../shared/models/primitive";

export function buildLoginUserResponse(
  userId: Id,
  userEmail: string,
  accessToken: string,
  refreshToken: string
): UserLoginResponse {
  return {
    id: userId,
    email: userEmail,
    timestamp: Date.now(),
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
}

export function buildCreateUserResponse(
  userId: Id,
  userEmail: string,
  accessToken: string,
  refreshToken: string
): CreateUserResponse {
  return {
    id: userId,
    email: userEmail,
    timestamp: Date.now(),
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
}
export function buildRefreshTokensResponse(
  userId: Id,
  accessToken: string,
  refreshToken: string
): RefreshTokenResponse {
  return {
    id: userId,
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
