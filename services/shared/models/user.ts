export interface LastUserActionRequest {
  accessToken: string;
}

export interface LastUserActionResponse {
  last: EpochTimeStamp | undefined;
}
