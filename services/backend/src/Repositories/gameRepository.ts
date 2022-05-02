import { getTileKey, Tile } from "@shared/models/game";

export class GameRepository {
  private fakeTilesRepository: Map<string, Tile>; //Coordinate -> Tile
  public constructor() {
    this.fakeTilesRepository = new Map<string, Tile>();
  }

  public setTile(tile: Tile): Promise<void> {
    this.fakeTilesRepository.set(
      getTileKey(tile),
      tile
    );
    return Promise.resolve();
  }

  public getAllTiles(): Promise<Tile[]> {
    return Promise.resolve(Object.values(this.fakeTilesRepository));
  }
}
