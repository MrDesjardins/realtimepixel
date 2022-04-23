export interface LastUserActionRequest {}

export interface LastUserActionResponse {
  last: EpochTimeStamp | undefined;
}
