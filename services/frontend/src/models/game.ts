/**
 * Positive number: 4 bytes
 **/
export type EpocTimestamps = number;

/**
 * UUID: 16 bytes
 **/
export type Id = string;

/**
 * Between 0 to 255 inclusively: 1 byte
 **/
export type Color = number;

/**
 * Value from 0 to 65536 inclusively: 2 bytes
 **/
export type CoordinateNumber = number;

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
  time: EpocTimestamps;
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
