import { Coordinate, getTileByCoordinateKey, getTileKey, Tile } from "@shared/models/game";
import { CONST_RULES } from "@shared/constants/rules";
import fs from "fs";
export class GameRepository {
  private static SAVE_FILE = GameRepository.name + ".txt";
  private fakeTilesRepository: Map<string, Tile>; //Coordinate -> Tile
  public constructor() {
    this.fakeTilesRepository = new Map<string, Tile>();
  }

  public async setTile(tile: Tile): Promise<void> {
    console.log("setTile", tile.coordinate);
    this.fakeTilesRepository.set(getTileKey(tile), tile);

    return this.persistOnDisk();
  }
  public async getTile(coordinate: Coordinate): Promise<Tile | undefined> {
    return Promise.resolve(
      this.fakeTilesRepository.get(getTileByCoordinateKey(coordinate))
    );
  }

  public async getAllTiles(): Promise<Tile[]> {
    return new Promise((resolve, reject) => {
      fs.readFile(GameRepository.SAVE_FILE, "utf8", (err, data) => {
        if (err) {
          reject(err);
        }
        this.fakeTilesRepository = new Map(JSON.parse(data));
        resolve(Array.from(this.fakeTilesRepository.values()));
      });
    });
  }

  public async removeExpiredTiles(): Promise<Tile[]> {
    await this.getAllTiles(); // Load from the persistent storage if not already in the map memory
    const currentEpochTimeMs: EpochTimeStamp = new Date().valueOf();
    const maxTileLifeMs =
      1000 *
      CONST_RULES.pixelInitialLifeUnit *
      CONST_RULES.decayDelaySeconds *
      CONST_RULES.decayValueReduction;
    const removedTiles: Tile[] = [];
    for (const [key, tile] of this.fakeTilesRepository.entries()) {
      if (currentEpochTimeMs - tile.time > maxTileLifeMs) {
        removedTiles.push({ ...tile });
        this.fakeTilesRepository.delete(key);
      }
    }
    await this.persistOnDisk();
    return Promise.resolve(removedTiles);
  }

  private async persistOnDisk(): Promise<void> {
    return new Promise((resolve, reject) => {
      const content = JSON.stringify(
        Array.from(this.fakeTilesRepository.entries())
      );
      fs.writeFile(GameRepository.SAVE_FILE, content, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }
}
