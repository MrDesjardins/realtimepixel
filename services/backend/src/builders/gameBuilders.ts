import {
  AllTilesResponse,
  RemoveExpiredTilesResponse,
  Tile,
} from "@shared/models/game";

export function buildAllTilesResponse(tiles: Tile[]): AllTilesResponse {
  return {
    tiles: tiles,
  };
}

export function buildRemoveExpiredTilesResponse(
  tiles: Tile[]
): RemoveExpiredTilesResponse {
  return {
    status: "ok",
    tilesRemovedCount: tiles.length,
  };
}
