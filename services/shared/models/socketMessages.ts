import { Color, Coordinate } from "./game";

export const MsgUserPixelKind = "MsgUserPixel";
export interface MsgUserPixel {
  kind: typeof MsgUserPixelKind;
  userToken: string;
  coordinate: Coordinate;
  color: Color;
}
