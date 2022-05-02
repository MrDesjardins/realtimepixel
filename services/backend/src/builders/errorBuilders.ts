import { BaseJsonResponse } from "@shared/models/response";
export function buildBaseJsonResponse(status: number, message: string): BaseJsonResponse {
  return {
    status: status,
    message: message,
  };
}
