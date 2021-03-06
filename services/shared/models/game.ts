import { Id } from "./primitive";

/**
 * Between 0 to 255 inclusively: 1 byte
 **/
export type Color = number;

/**
 * Value from 0 to 65536 inclusively: 2 bytes
 **/
export type CoordinateNumber = number;

export interface Coordinate {
  x: CoordinateNumber;
  y: CoordinateNumber;
}

/**
 * Represent 1 pixel placed by a user
 * Each tile is 25 bytes
 */
export interface Tile {
  coordinate: Coordinate; // This is NOT pixel but coordinate
  time: EpochTimeStamp;
  userId: Id;
  color: Color;
}

export function getTileKey(tile: Tile): string {
  return getTileByCoordinateKey(tile.coordinate);
}
export function getTileByCoordinateKey(coordinate: Coordinate): string {
  return `${coordinate.x}-${coordinate.y}`;
}

export interface AllTilesRequest {}
export interface AllTilesResponse {
  tiles: Tile[];
}

export interface RemoveExpiredTilesRequest {}
export interface RemoveExpiredTilesResponse {
  status: string;
  tilesRemovedCount: number;
}
