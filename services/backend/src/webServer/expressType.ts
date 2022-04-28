import { Send } from "express-serve-static-core";
export interface TypedRequestBody<T> extends Express.Request {
  body: T;
  headers?: any;
  jwtPayload?: RequestUserFromJwt | undefined;
}

export interface TypedResponse<ResBody> extends Express.Response {
  json: Send<ResBody, this>;
  status: any;
}

export interface RequestUserFromJwt {
  user: string; // Email
  iat: number; // “issued at” helps identify the date/time issued
  exp: number; // “expires at” helps identify the date/time the token will expire
}
