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
import { AuthRepository } from "../Repositories/authRepository";
import { TokenRepository } from "../Repositories/tokenRepository";
import { RequestUserFromJwt } from "../webServer/expressType";
import { BaseService } from "./baseService";
export class AuthService extends BaseService {
  private authRepository: AuthRepository;
  private tokenRepository: TokenRepository;
  public constructor(environment: ServiceEnvironment) {
    super(environment);
    this.authRepository = new AuthRepository();
    this.tokenRepository = new TokenRepository();
  }

  /**
   * Goal is to get a valid token which is only possible for a valid user.
   *
   **/
  public async authenticate(request: UserLoginRequest): Promise<TokenResponse> {
    try {
      const passwordHashed = await this.authRepository.getUserHashPassword(
        request.email
      );

      const isPasswordFound = await bcrypt.compare(
        request.password,
        passwordHashed ?? ""
      );
      if (isPasswordFound) {
        const accessToken = this.generateAccessToken(request.email);
        const refreshToken = this.generateRefreshToken(request.email);
        await this.tokenRepository.updateTokens(
          request.email,
          accessToken,
          refreshToken
        );
        return { accessToken, refreshToken };
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
    try {
      await this.authRepository.createUser(userEmail, hashedPassword);
      const accessToken = this.generateAccessToken(request.email);
      const refreshToken = this.generateRefreshToken(request.email);
      await this.tokenRepository.updateTokens(
        request.email,
        accessToken,
        refreshToken
      );
      return { accessToken, refreshToken };
    } catch (e) {
      throw e;
    }
  }
  public async refreshTokens(
    request: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    if (await this.tokenRepository.hasToken(request.email)) {
      const tokens = await this.tokenRepository.getToken(request.email);
      if (tokens?.refreshToken === request.refreshToken) {
        const accessToken = this.generateAccessToken(request.email);
        const refreshToken = this.generateRefreshToken(request.email);
        await this.tokenRepository.updateTokens(
          request.email,
          accessToken,
          refreshToken
        );
        return { accessToken, refreshToken };
      }
    }
    throw new Error("Invalid refresh token");
  }
  public async logout(userEmail: string): Promise<LogoutResponse> {
    if (await this.tokenRepository.hasToken(userEmail)) {
      this.tokenRepository.removeToken(userEmail);
    }

    return {};
  }

  public async verifyAccess(
    accessToken: string
  ): Promise<RequestUserFromJwt> {
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

  private generateAccessToken(email: string): string {
    return jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET ?? "", {
      expiresIn: EXPIRATIONS.accessTokenMs,
    });
  }

  private generateRefreshToken(email: string): string {
    const refreshToken = jwt.sign(
      { email: email },
      process.env.REFRESH_TOKEN_SECRET ?? "",
      {
        expiresIn: EXPIRATIONS.refreshTokenMs,
      }
    );
    return refreshToken;
  }
}
