import { getTileKey, Tile } from "@shared/models/game";

/**
 * Transforms a list of tiles from the backend to a map for the frontend
 **/
export function buildMapFromList(tiles: Tile[]): Map<string, Tile> {
  const tiles2 = tiles.map((i) => {
    return [getTileKey(i), i];
  });
  const existingTiles: Map<string, Tile> = new Map(tiles2 as any);
  return existingTiles;
}
