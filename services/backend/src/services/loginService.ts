import { ServiceEnvironment } from "@shared/constants/backend";
import {
  CreateUserRequest,
  LogoutRequest,
  LogoutResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  TokenResponse,
  UserLoginRequest,
} from "@shared/models/login";
import { BaseService } from "./baseService";
import bcrypt from "bcrypt";
import jwt, { Jwt, JwtPayload, VerifyErrors } from "jsonwebtoken";
import { RequestUserFromJwt } from "../webServer/expressType";
export class LoginService extends BaseService {
  private allRefreshTokens: string[] = []; // Need to be moved into Redis for all servers to access
  public constructor(environment: ServiceEnvironment) {
    super(environment);
  }

  /**
   * Goal is to get a valid token which is only possible for a valid user.
   *
   * @returns String with a valid token if the user is not valid, rejection (exception) otherwise.
   **/
  public async authenticate(request: UserLoginRequest): Promise<TokenResponse> {
    console.log("loginService.authenticate");

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        // Todo: Fetch the user hashed email from its email
        const hashedPasswordFromEmail =
          "$2b$10$Nn8UZsQQuhsnSxLI60gl3eAAJKpWPeaACnyffepEwh4JAsBS.Ckhy"; // Hardcoded for "test"
        const isPasswordFound = await bcrypt.compare(
          request.password,
          hashedPasswordFromEmail
        );

        if (isPasswordFound) {
          const accessToken = this.generateAccessToken(request.email);
          const refreshToken = this.generateRefreshToken(request.email);
          resolve({ accessToken, refreshToken });
        } else {
          reject("Wrong email/password");
        }
      }, 500);
    });
  }

  public async create(request: CreateUserRequest): Promise<TokenResponse> {
    const userEmail = request.email;
    const hashedPassword = await bcrypt.hash(request.password, 10);
    console.log("loginService.create", userEmail, hashedPassword);
    // Todo: Persist the user in the database
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const accessToken = this.generateAccessToken(request.email);
        const refreshToken = this.generateRefreshToken(request.email);
        resolve({ accessToken, refreshToken });
        // Todo: reject("Already an account on this email");
      }, 500);
    });
  }
  public async refreshTokens(
    request: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    if (this.allRefreshTokens.includes(request.refreshToken)) {
      const accessToken = this.generateAccessToken(request.email);
      const refreshToken = this.generateRefreshToken(request.email);
      return { accessToken, refreshToken };
    } else {
      throw new Error("Invalid refresh token");
    }
  }
  public async logout(request: LogoutRequest): Promise<LogoutResponse> {
    this.allRefreshTokens = this.allRefreshTokens.filter(
      (t) => t !== request.refreshToken
    );
    return {};
  }

  public async verifyAccess(
    accessToken: string
  ): Promise<RequestUserFromJwt | undefined> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET ?? "",
        (err: VerifyErrors | null, user: any) => {
          if (err) {
            reject(err.message);
          } else {
            resolve(user);
          }
        }
      );
    });
  }

  private generateAccessToken(email: string): string {
    return jwt.sign(email, process.env.ACCESS_TOKEN_SECRET ?? "", {
      expiresIn: "15m",
    });
  }

  private generateRefreshToken(email: string): string {
    const refreshToken = jwt.sign(
      email,
      process.env.REFRESH_TOKEN_SECRET ?? "",
      {
        expiresIn: "20m",
      }
    );
    this.allRefreshTokens.push(refreshToken);
    return refreshToken;
  }
}
