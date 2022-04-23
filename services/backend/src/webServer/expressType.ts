import { Send } from "express-serve-static-core";
export interface TypedRequestBody<T> extends Express.Request {
  body: T;
  headers?: any;
}

export interface TypedResponse<ResBody> extends Express.Response {
  json: Send<ResBody, this>;
  status: any;
}
