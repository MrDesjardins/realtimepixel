import { UserLoginResponse, CreateUserResponse } from "@shared/models/login";

export function buildLoginUserResponse(
  userEmail: string,
  userToken: string
): UserLoginResponse {
  return {
    email: userEmail,
    timestamp: Date.now(),
    token: userToken,
  };
}

export function buildCreateUserResponse(
  userEmail: string,
  userToken: string
): CreateUserResponse {
  return {
    email: userEmail,
    timestamp: Date.now(),
    token: userToken,
  };
}
