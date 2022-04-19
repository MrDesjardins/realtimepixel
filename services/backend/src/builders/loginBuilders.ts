import { LoginResponse } from "@shared/models/login";

export function buildLoginResponse(
  userEmail: string,
  userToken: string
): LoginResponse {
  return {
    email: userEmail,
    timestamp: Date.now(),
    token: userToken,
  };
}
