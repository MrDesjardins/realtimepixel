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
  coordinate: Coordinate;
  time: EpochTimeStamp;
  userId: Id;
  color: Color;
}
