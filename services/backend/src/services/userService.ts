import { ServiceEnvironment } from "@shared/constants/backend";
import { CONST_RULES } from "@shared/constants/rules";
import { Id } from "@shared/models/primitive";
import { createClient } from "redis";
import {
  UserRepository,
  UserTableSchema,
} from "../Repositories/userRepository";
import { BaseService } from "./baseService";
export class UserService extends BaseService {
  private userRepository: UserRepository;
  public constructor(
    environment: ServiceEnvironment,
    redisClient: ReturnType<typeof createClient>
  ) {
    super(environment);
    this.userRepository = new UserRepository(redisClient);
  }

  public async getUser(id: Id): Promise<UserTableSchema | undefined> {
    const user = await this.userRepository.getUser(id);

    if (user !== undefined && user.lastUserAction === undefined) {
      user.lastUserAction =
        new Date().valueOf() - CONST_RULES.userPixelDelaySeconds * 1000;
    }

    return Promise.resolve(user);
  }

  public async setLastUserAction(id: Id, time: EpochTimeStamp): Promise<void> {
    const user = await this.userRepository.getUser(id);
    if (user === undefined) {
      return Promise.reject("User not found");
    }
    return this.userRepository.updateUser(id, {
      ...user,
      lastUserAction: time,
    });
  }

  public async addUserSocket(id: Id, socketId: string): Promise<void> {
    const user = await this.userRepository.getUser(id);
    if (user !== undefined) {
      this.userRepository.addUserSocket(id, socketId);
    }
  }

  public async removeUserSocket(id: Id, socketId: string): Promise<void> {
    const user = await this.userRepository.getUser(id);
    if (user !== undefined) {
      this.userRepository.removeUserSocket(id, socketId);
    }
  }
}
