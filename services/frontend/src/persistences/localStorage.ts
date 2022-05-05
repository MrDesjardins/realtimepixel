import Cookies from "js-cookie";
import { AUTH_CONST } from "@shared/constants/authentication";
import { TokenResponse } from "@shared/models/login";
const TOKEN_KEY = "token";
export function persistTokenInUserMachine(token: TokenResponse | undefined): void {
  if (token === undefined) {
    Cookies.remove(TOKEN_KEY);
  } else {
    Cookies.set(TOKEN_KEY, JSON.stringify(token), { expires: AUTH_CONST.cookie_day });
  }
}

export function getTokenFromUserMachine(): TokenResponse | undefined {
  const serializedData = Cookies.get(TOKEN_KEY);
  if (serializedData === undefined) {
    return undefined;
  }
  return JSON.parse(serializedData) as TokenResponse;
}
