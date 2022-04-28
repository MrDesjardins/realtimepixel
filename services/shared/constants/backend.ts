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
  create: "create",
  refreshtokens: "refreshtokens",
  logout: "logout",
  lastUserAction: "lastUserAction",
};
