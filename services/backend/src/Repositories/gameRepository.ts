import { getTileKey, Tile } from "@shared/models/game";
import fs from "fs";
export class GameRepository {
  private static SAVE_FILE = GameRepository.name + ".txt";
  private fakeTilesRepository: Map<string, Tile>; //Coordinate -> Tile
  public constructor() {
    this.fakeTilesRepository = new Map<string, Tile>();
  }

  public setTile(tile: Tile): Promise<void> {
    this.fakeTilesRepository.set(getTileKey(tile), tile);

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

  public getAllTiles(): Promise<Tile[]> {
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
}
