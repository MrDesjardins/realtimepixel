import {
  LastUserActionResponse,
  RemoveExpiredTilesResponse,
} from "@shared/models/user";
export function buildLastActionResponse(
  ts: EpochTimeStamp | undefined
): LastUserActionResponse {
  return {
    last: ts,
  };
}

export function buildRemoveUsersSocketsResponse(): RemoveExpiredTilesResponse {
  return {
    status: "ok",
  };
}
