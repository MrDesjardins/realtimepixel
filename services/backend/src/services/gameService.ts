import { ServiceEnvironment } from "@shared/constants/backend";
import { Coordinate, Tile } from "@shared/models/game";
import { createClient } from "redis";
import { GameRepository } from "../Repositories/gameRepository";
import { BaseService } from "./baseService";
export class GameService extends BaseService {
  private gameRepository: GameRepository;
  public constructor(
    environment: ServiceEnvironment,
    redisClient: ReturnType<typeof createClient>
  ) {
    super(environment);
    this.gameRepository = new GameRepository(redisClient);
  }

  public async setTile(tile: Tile): Promise<void> {
    this.gameRepository.setTile(tile);
  }

  public async getTile(coordinate: Coordinate): Promise<Tile | undefined> {
    return this.gameRepository.getTile(coordinate);
  }

  public async getAllTiles(): Promise<Tile[]> {
    return this.gameRepository.getAllTiles();
  }

  public async removeExpiredTiles(): Promise<Tile[]> {
    return this.gameRepository.removeExpiredTiles();
  }
}
