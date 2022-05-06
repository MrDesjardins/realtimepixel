import { Color, Coordinate, Tile } from "./game";
import { Id } from "./primitive";

export interface BaseMsg {
  accessToken: string;
}
export const MsgUserPixelKind = "MsgUserPixel";
export interface MsgUserPixel extends BaseMsg {
  kind: typeof MsgUserPixelKind;
  coordinate: Coordinate;
  color: Color;
}

export const MsgUserPixelValidationKind = "MsgUserPixelValidationKind";
export interface MsgUserPixelValidation {
  kind: typeof MsgUserPixelValidationKind;
  userId: Id;
  status: "ok";
  last: EpochTimeStamp | undefined;
  coordinate: Coordinate;
  colorBeforeRequest: Color;
}

export const MsgErrorKind = "MsgErrorKind";
export interface MsgError {
  kind: typeof MsgErrorKind;
  errorMessage: string;
}

export const MsgBroadcastNewPixelKind = "MsgBroadcastNewPixelKind";
export interface MsgBroadcastNewPixel {
  kind: typeof MsgBroadcastNewPixelKind;
  tile: Tile;
}
