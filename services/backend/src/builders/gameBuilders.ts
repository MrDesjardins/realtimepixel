import { AllTilesResponse, Tile } from "@shared/models/game";

export function buildAllTilesResponse(tiles: Tile[]): AllTilesResponse {
  return {
    tiles: tiles,
  };
}
