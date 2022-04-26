export interface LastUserActionRequest {
  token: string;
}

export interface LastUserActionResponse {
  last: EpochTimeStamp | undefined;
}
