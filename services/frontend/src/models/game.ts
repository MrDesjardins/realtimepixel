import { Tile } from "@shared/models/game";

export interface GameBoard {
  /**
   * Represent all pixels on the board
   * A board of 1000 x 1000 tiles is 24megs
   **/
  tiles: Tile[][];
}
