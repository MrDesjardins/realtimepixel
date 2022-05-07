import { Id } from "../../../shared/models/primitive";
import { Request, Response } from "express";

export interface TypedRequestBody<T> extends Request {
  //body: T;
  jwtPayload?: RequestUserFromJwt | undefined;
}

export interface TypedResponse<ResBody> extends Response {
  // json: Send<ResBody, this>;
  // status: any;
}

export interface RequestUserFromJwt {
  id: Id; // Uuid
  email: string; // Email
  iat: number; // “issued at” helps identify the date/time issued
  exp: number; // “expires at” helps identify the date/time the token will expire
}
