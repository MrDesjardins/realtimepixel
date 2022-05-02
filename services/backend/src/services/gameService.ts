import { ServiceEnvironment } from "@shared/constants/backend";
import { Tile } from "@shared/models/game";
import { GameRepository } from "../Repositories/gameRepository";
import { BaseService } from "./baseService";
export class GameService extends BaseService {
  private gameRepository: GameRepository;
  public constructor(environment: ServiceEnvironment) {
    super(environment);
    this.gameRepository = new GameRepository();
  }

  public async setTile(tile: Tile): Promise<void> {
    this.gameRepository.setTile(tile);
  }

  public async getAllTiles(): Promise<Tile[]> {
    return this.gameRepository.getAllTiles();
  }
}
