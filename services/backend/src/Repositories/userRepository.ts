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
  emailValidated: boolean;
}
const ID_PREFIX = "userid:";
const INDEX_EMAIL_ID_PREFIX = "email_userid:";

export class UserRepository {
  public constructor(private redisClient: ReturnType<typeof createClient>) {
    // Create a fake test user
    this.getUser("9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d").then((user) => {
      if (user === undefined) {
        console.log("Creating a test user");
        this.createUser({
          id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
          email: "test",
          lastUserAction: undefined,
          hashedPassword:
            "$2b$10$s3QW1sdKx0tfbAukb19WZ.k3owqEVxYYuF8cngXzP7bI0VJil5fxG", // Password: 123123
          accessToken: undefined,
          refreshToken: undefined,
          socketIds: [],
          emailValidated: true,
        });
      }
    });
  }
  public async getUser(id: Id): Promise<UserTableSchema | undefined> {
    const serializedUser = await this.redisClient.get(ID_PREFIX + id);
    if (serializedUser === null) {
      return Promise.resolve(undefined);
    }
    const user = JSON.parse(serializedUser) as UserTableSchema;
    return Promise.resolve(user);
  }
  public async getUserByEmail(
    email: string
  ): Promise<UserTableSchema | undefined> {
    const id = await this.redisClient.get(INDEX_EMAIL_ID_PREFIX + email);
    if (id === null) {
      return Promise.resolve(undefined);
    }
    return this.getUser(id);
  }

  public async getUserHashPassword(email: string): Promise<string | undefined> {
    const user = await this.getUserByEmail(email);
    if (user === undefined) {
      throw new Error("Wrong email/password");
    } else {
      return user.hashedPassword;
    }
  }

  public async createUser(data: UserTableSchema): Promise<UserTableSchema> {
    const serializedUser = await this.getUserByEmail(data.email);
    if (serializedUser !== undefined) {
      throw new Error("User already exists");
    }
    return this.updateUser(data);
  }

  public async updateUser(data: UserTableSchema): Promise<UserTableSchema> {
    const s1 = this.redisClient.set(ID_PREFIX + data.id, JSON.stringify(data));
    const s2 = this.redisClient.set(
      INDEX_EMAIL_ID_PREFIX + data.email,
      data.id
    );
    await Promise.all([s1, s2]);
    return Promise.resolve(data);
  }

  public async updateTokens(
    id: Id,
    accessToken: string | undefined,
    refreshToken: string | undefined
  ): Promise<UserTableSchema> {
    const existingUser = await this.getUser(id);
    if (existingUser === undefined) {
      return Promise.reject();
    }
    return this.updateUser({
      ...existingUser,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }

  public async hasToken(id: Id): Promise<boolean> {
    const user = await this.getUser(id);
    return Promise.resolve(user?.accessToken !== undefined);
  }
  public async removeToken(id: Id): Promise<UserTableSchema> {
    return this.updateTokens(id, undefined, undefined);
  }

  public async removeUserSocket(
    id: string,
    socketId: string
  ): Promise<UserTableSchema> {
    const existingUser = await this.getUser(id);
    if (existingUser === undefined) {
      return Promise.reject();
    } else {
      return this.updateUser({
        ...existingUser,
        socketIds: existingUser.socketIds.filter((s) => s !== socketId),
      });
    }
  }
  public async addUserSocket(
    id: string,
    socketId: string
  ): Promise<UserTableSchema> {
    const existingUser = await this.getUser(id);
    if (existingUser === undefined) {
      return Promise.reject();
    } else {
      return this.updateUser({
        ...existingUser,
        socketIds: [...existingUser.socketIds, socketId],
      });
    }
  }

  public async removeAllUsersSocketsAndCredentials(): Promise<number> {
    let count = 0;
    try {
      const existingUsers = await this.getAllUsers();
      for (const user of existingUsers) {
        const existingUserWithoutSocket: UserTableSchema = {
          ...user,
          accessToken: undefined,
          refreshToken: undefined,
          socketIds: [],
        };
        count++;
        this.updateUser(existingUserWithoutSocket);
      }
      return Promise.resolve(count);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async getAllUsers(): Promise<UserTableSchema[]> {
    let users: UserTableSchema[] = [];

    for await (const key of this.redisClient.scanIterator({
      TYPE: "string",
      MATCH: ID_PREFIX + "*",
      COUNT: 1000,
    })) {
      const user = await this.redisClient.get(key);
      if (user !== null) {
        users.push(JSON.parse(user) as UserTableSchema);
      }
    }
    return Promise.resolve(users);
  }
}
