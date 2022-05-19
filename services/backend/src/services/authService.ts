import { EXPIRATIONS, ServiceEnvironment } from "@shared/constants/backend";
import {
  CreateUserRequest,
  LogoutResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  TokenResponse,
  UserLoginRequest,
} from "@shared/models/login";
import bcrypt from "bcrypt";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { RequestUserFromJwt } from "../webServer/expressType";
import { BaseService } from "./baseService";
import { v4 as uuidv4 } from "uuid";
import { UserRepository } from "../Repositories/userRepository";
import { Id } from "@shared/models/primitive";
import { createClient } from "redis";

export class AuthService extends BaseService {
  private repository: UserRepository;
  public constructor(
    environment: ServiceEnvironment,
    redisClient: ReturnType<typeof createClient>
  ) {
    super(environment);
    this.repository = new UserRepository(redisClient);
  }

  /**
   * Goal is to get a valid token which is only possible for a valid user.
   *
   **/
  public async authenticate(request: UserLoginRequest): Promise<TokenResponse> {
    try {
      const user = await this.repository.getUserByEmail(request.email);
      if (user === undefined) {
        throw new Error("User not found");
      }
      const isPasswordFound = await bcrypt.compare(
        request.password,
        user.hashedPassword ?? ""
      );
      if (isPasswordFound) {
        const accessToken = this.generateAccessToken(user.id, request.email);
        const refreshToken = this.generateRefreshToken(user.id, request.email);
        await this.repository.updateTokens(user.id, accessToken, refreshToken);
        return { id: user.id, accessToken, refreshToken };
      } else {
        throw Error("Password does not match for this user");
      }
    } catch (e) {
      throw Error("Wrong email/password");
    }
  }

  public async create(request: CreateUserRequest): Promise<TokenResponse> {
    const userEmail = request.email;
    const hashedPassword = await bcrypt.hash(request.password, 10);
    console.log("loginService.create", userEmail, hashedPassword);

    const newUserId = uuidv4();
    const accessToken = this.generateAccessToken(newUserId, request.email);
    const refreshToken = this.generateRefreshToken(newUserId, request.email);
    const newUser = await this.repository.createUser({
      id: newUserId,
      email: userEmail,
      hashedPassword: hashedPassword,
      accessToken: accessToken,
      refreshToken: refreshToken,
      lastUserAction: undefined,
      socketIds: [],
      emailValidated: false,
    });
    return { id: newUser.id, accessToken, refreshToken };
  }
  public async refreshTokens(
    request: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    const user = await this.repository.getUser(request.id);
    if (user?.refreshToken === request.refreshToken) {
      const accessToken = this.generateAccessToken(user.id, user.email);
      const refreshToken = this.generateRefreshToken(user.id, user.email);
      await this.repository.updateTokens(request.id, accessToken, refreshToken);
      return { id: user.id, accessToken, refreshToken };
    }

    throw new Error("Invalid refresh token");
  }
  public async logout(id: Id): Promise<LogoutResponse> {
    if (await this.repository.hasToken(id)) {
      const user = await this.repository.removeToken(id);
      if (user.accessToken === undefined && user.refreshToken === undefined) {
        return Promise.resolve({});
      }
    }
    throw new Error("No User to logout");
  }

  public async verifyAccess(accessToken: string): Promise<RequestUserFromJwt> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET ?? "",
        (err: VerifyErrors | null, data: any) => {
          if (err) {
            reject(err.message);
          } else {
            resolve(data);
          }
        }
      );
    });
  }

  private generateAccessToken(id: Id, email: string): string {
    return jwt.sign(
      { id: id, email: email },
      process.env.ACCESS_TOKEN_SECRET ?? "",
      {
        expiresIn: EXPIRATIONS.accessTokenMs,
      }
    );
  }

  private generateRefreshToken(id: Id, email: string): string {
    const refreshToken = jwt.sign(
      { id: id, email: email },
      process.env.REFRESH_TOKEN_SECRET ?? "",
      {
        expiresIn: EXPIRATIONS.refreshTokenMs,
      }
    );
    return refreshToken;
  }
}
