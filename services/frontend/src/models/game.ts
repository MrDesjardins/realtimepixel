import { Id } from '@shared/models/primitive';
import { CoordinateNumber, Color } from '@shared/models/game';
export interface Game {
  tiles: Tile[][];
}

export interface Coordinate {
  x: CoordinateNumber;
  y: CoordinateNumber;
}

/**
 * Represent 1 pixel placed by a user
 * Each tile is 25 bytes
 */
export interface Tile {
  coordinate: Coordinate;
  time: EpochTimeStamp;
  userId: Id;
  color: Color;
}

export interface GameBoard {
  /**
   * Represent all pixels on the board
   * A board of 1000 x 1000 tiles is 24megs
   **/
  tiles: Tile[][];
}
