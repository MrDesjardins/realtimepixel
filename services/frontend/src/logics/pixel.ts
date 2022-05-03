import { CONSTS } from "../models/constants";
import { Coordinate } from "@shared/models/game";

export function getClosestPixel(coordinate: Coordinate): Coordinate {
  const x = Math.floor(coordinate.x / CONSTS.gameBoard.pixelSizePx) * CONSTS.gameBoard.pixelSizePx;
  const y = Math.floor(coordinate.y / CONSTS.gameBoard.pixelSizePx) * CONSTS.gameBoard.pixelSizePx;
  return { x, y };
}

export function getAdjustedPixel(coordinate: Coordinate): Coordinate {
  const closest = getClosestPixel(coordinate);
  return {
    x: closest.x / CONSTS.gameBoard.pixelSizePx,
    y: closest.y / CONSTS.gameBoard.pixelSizePx,
  };
}

export function getCoordinateToPixelValue(coordinate: Coordinate): Coordinate {

  return {
    x: coordinate.x * CONSTS.gameBoard.pixelSizePx,
    y: coordinate.y * CONSTS.gameBoard.pixelSizePx,
  };
}