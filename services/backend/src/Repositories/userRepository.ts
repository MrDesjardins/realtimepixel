import { Id } from "@shared/models/primitive";
import { createClient } from "redis";

export interface UserTableSchema {
  id: Id;
  email: string;
  lastUserAction: EpochTimeStamp | undefined;
  hashedPassword: string;
  accessToken: string | undefined;
  refreshToken: string | undefined;
  socketIds: string[];
}

export class UserRepository {
  private fakeRepository: Map<Id, UserTableSchema>; //Id -> Last time
  private indexEmailId: Map<string, Id>;

  public constructor(private redisClient: ReturnType<typeof createClient>) {
    this.fakeRepository = new Map<Id, UserTableSchema>();
    this.indexEmailId = new Map<string, Id>();

    // Create a fake test user
    this.fakeRepository.set("9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", {
      id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      email: "test",
      lastUserAction: undefined,
      hashedPassword:
        "$2b$10$rx9NrjdGk4WJ.f8cUUvr0eYdoFl8aHe6VCyZ6M.4RPBoJF45z2eZK",
      accessToken: undefined,
      refreshToken: undefined,
      socketIds: [],
    });
    this.indexEmailId.set("test", "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d");
  }
  public async getUser(id: Id): Promise<UserTableSchema | undefined> {
    return Promise.resolve(this.fakeRepository.get(id));
  }
  public async getUserByEmail(
    email: string
  ): Promise<UserTableSchema | undefined> {
    const id = this.indexEmailId.get(email);
    if (id === undefined) {
      return Promise.resolve(undefined);
    }
    return Promise.resolve(this.fakeRepository.get(id));
  }

  public async getUserHashPassword(email: string): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const id = this.indexEmailId.get(email);
        if (id === undefined) {
          reject("Wrong email/password");
        } else {
          const user = this.fakeRepository.get(id);
          resolve(user?.hashedPassword);
        }
      }, 500);
    });
  }

  public async createUser(data: UserTableSchema): Promise<UserTableSchema> {
    if (this.fakeRepository.has(data.email)) {
      throw new Error("User already exists");
    }
    return new Promise((resolve) => {
      setTimeout(async () => {
        this.fakeRepository.set(data.id, data);
        this.indexEmailId.set(data.email, data.id);
        resolve(data);
      }, 500);
    });
  }

  public async updateUser(id: Id, data: UserTableSchema): Promise<void> {
    this.indexEmailId.set(data.email, id);
    this.fakeRepository.set(id, data);
    Promise.resolve();
  }

  public async updateTokens(
    id: Id,
    accessToken: string | undefined,
    refreshToken: string | undefined
  ): Promise<void> {
    const existingUser = this.fakeRepository.get(id);
    if (existingUser === undefined) {
      Promise.reject();
    } else {
      this.fakeRepository.set(id, {
        ...existingUser,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
      return Promise.resolve();
    }
  }

  public async hasToken(id: Id): Promise<boolean> {
    return Promise.resolve(this.fakeRepository.has(id));
  }
  public async removeToken(id: Id): Promise<void> {
    this.updateTokens(id, undefined, undefined);
    return Promise.resolve();
  }

  removeUserSocket(id: string, socketId: string) {
    const existingUser = this.fakeRepository.get(id);
    if (existingUser === undefined) {
      Promise.reject();
    } else {
      this.fakeRepository.set(id, {
        ...existingUser,
        socketIds: existingUser.socketIds.filter((s) => s !== socketId),
      });
      return Promise.resolve();
    }
  }
  addUserSocket(id: string, socketId: string) {
    const existingUser = this.fakeRepository.get(id);
    if (existingUser === undefined) {
      Promise.reject();
    } else {
      this.fakeRepository.set(id, {
        ...existingUser,
        socketIds: [...existingUser.socketIds, socketId],
      });
      return Promise.resolve();
    }
  }
}
