import { CONSTS } from "../models/constants";
import { Coordinate } from "../models/game";

export function getClosestPixel(coordinate: Coordinate): Coordinate {
  const x =
    Math.floor(coordinate.x / CONSTS.gameBoard.pixelSize) *
    CONSTS.gameBoard.pixelSize;
  const y =
    Math.floor(coordinate.y / CONSTS.gameBoard.pixelSize) *
    CONSTS.gameBoard.pixelSize;
  return { x, y };
}

export function getAdjustedPixel(coordinate: Coordinate): Coordinate {
  const closest = getClosestPixel(coordinate);
  return {
    x: closest.x / CONSTS.gameBoard.pixelSize,
    y: closest.y / CONSTS.gameBoard.pixelSize,
  };
}
