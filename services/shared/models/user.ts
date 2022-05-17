export interface LastUserActionRequest {
  accessToken: string;
}

export interface LastUserActionResponse {
  last: EpochTimeStamp | undefined;
}

export interface RemoveExpiredTilesResponse {
  status: "ok";
}
