import { LastUserActionResponse } from "@shared/models/user";
export function buildLastActionResponse(
  ts: EpochTimeStamp | undefined
): LastUserActionResponse {
  return {
    last: ts,
  };
}
