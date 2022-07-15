/**
 * Decouple the service environment from the NODE_ENV variable.
 * The reason is that we might want to be in dev environment and testing in production or
 * in the future to have a test, beta or production environment which are not one to one
 * with the NODE_ENV variable.
 **/
export enum ServiceEnvironment {
  Test = "Test",
  Production = "Production",
}

export const HEADERS = {
  authorization: "authorization",
};

export const URLS = {
  login: "login",
  health: "health",
  create: "create",
  refreshtokens: "refreshtokens",
  logout: "logout",
  lastUserAction: "lastUserAction",
  allTiles: "allTiles",
  removeExpiredTiles: "removeExpiredTiles",
  clearUsersSocketsAndCredentials: "clearUsersSocketsAndCredentials",
};

export const URLS_UNSECURE = [
  URLS.health,
  URLS.login,
  URLS.create,
  URLS.refreshtokens,
  URLS.allTiles,
  URLS.removeExpiredTiles,
];

export const HTTP_STATUS = {
  ok: 200,
  bad_request: 400,
  token_missing: 400,
  token_invalid: 401,
  account_not_validated: 401,
  valid_but_not_authorization: 403,
};

export const EXPIRATIONS = {
  accessTokenMs: 15 * 60 * 60,
  refreshTokenMs: 20 * 60 * 60,
};
