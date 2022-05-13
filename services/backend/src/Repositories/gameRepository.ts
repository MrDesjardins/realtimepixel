import {
  Coordinate,
  getTileByCoordinateKey,
  getTileKey,
  Tile,
} from "@shared/models/game";
import { CONST_RULES } from "@shared/constants/rules";
import fs from "fs";
import { getTileLife } from "@shared/logics/time";
import { createClient } from "redis";
const GAME_PREFIX = "coordinate_tile:";
export class GameRepository {
  public constructor(private redisClient: ReturnType<typeof createClient>) {}

  public async setTile(tile: Tile): Promise<void> {
    console.log("setTile", tile.coordinate);
    await this.redisClient.set(
      GAME_PREFIX + getTileKey(tile),
      JSON.stringify(tile)
    );
    return Promise.resolve();
  }
  public async getTile(coordinate: Coordinate): Promise<Tile | undefined> {
    const serializedTile = await this.redisClient.get(
      GAME_PREFIX + getTileByCoordinateKey(coordinate)
    );
    if (serializedTile === null) {
      return Promise.resolve(undefined);
    }
    const tile = JSON.parse(serializedTile) as Tile;
    return Promise.resolve(tile);
  }

  public async getAllTiles(): Promise<Tile[]> {
    let tiles: Tile[] = [];

    for await (const key of this.redisClient.scanIterator({
      TYPE: "string",
      MATCH: GAME_PREFIX + "*",
      COUNT: 1000,
    })) {
      const tile = await this.redisClient.get(key);
      if (tile !== null) {
        tiles.push(JSON.parse(tile) as Tile);
      }
    }
    return Promise.resolve(tiles);
  }

  public async removeExpiredTiles(): Promise<Tile[]> {
    const tiles = await this.getAllTiles(); // Load from the persistent storage if not already in the map memory
    const currentEpochTimeMs: EpochTimeStamp = new Date().valueOf();
    const removedTiles: Tile[] = [];
    for (const tile of tiles) {
      if (getTileLife(currentEpochTimeMs, tile.time) === 0) {
        removedTiles.push({ ...tile });
        await this.redisClient.del(GAME_PREFIX + getTileKey(tile));
      }
    }
    return Promise.resolve(removedTiles);
  }
}
