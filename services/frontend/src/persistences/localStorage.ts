import Cookies from "js-cookie";
import { AUTH_CONST } from "@shared/constants/authentication";
const TOKEN_KEY = "token";
export function persistTokenInUserMachine(token: string | undefined): void {
  if (token === undefined) {
    Cookies.remove(TOKEN_KEY);
  } else {
    Cookies.set(TOKEN_KEY, token, { expires: AUTH_CONST.cookie_day });
  }
}

export function getTokenFromUserMachine(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}