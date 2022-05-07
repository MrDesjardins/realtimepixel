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

export function buildRemoveExpiredTilesResponse(): RemoveExpiredTilesResponse {
  return {
    status: "ok",
  };
}
