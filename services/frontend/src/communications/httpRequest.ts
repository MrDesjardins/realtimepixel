import { HEADERS, HTTP_STATUS, URLS } from "@shared/constants/backend";
import { AllTilesResponse } from "@shared/models/game";
import {
  CreateUserRequest,
  CreateUserResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  UserLoginRequest,
  UserLoginResponse,
} from "@shared/models/login";
import { LastUserActionRequest, LastUserActionResponse } from "@shared/models/user";
import { ENV_VARIABLES } from "../generated/constants_env";

export class HttpRequest {
  private baseUrl: string = "";
  public constructor() {
    // Reverse proxy
    this.baseUrl = `http://${ENV_VARIABLES.IP_FRONTEND}:${ENV_VARIABLES.OUTER_PORT_FRONTEND}/api`;
  }

  public async createUser(createRequest: CreateUserRequest): Promise<CreateUserResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${URLS.create}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createRequest),
      });
      if (HttpRequest.isBadResponse(response)) {
        throw Error("Create failed");
      }
      return response.json();
    } catch (e) {
      console.error("Error Create User", e);
      throw e;
    }
  }

  public async login(loginRequest: UserLoginRequest): Promise<UserLoginResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${URLS.login}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginRequest),
      });
      if (HttpRequest.isBadResponse(response)) {
        throw Error("Login failed");
      }
      return response.json();
    } catch (e) {
      console.error("Error login", e);
      throw e;
    }
  }

  public async refreshToken(loginRequest: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${URLS.refreshtokens}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginRequest),
      });
      if (HttpRequest.isBadResponse(response)) {
        throw Error("Refresh failed");
      }
      return response.json();
    } catch (e) {
      console.error("Error refresh token", e);
      throw e;
    }
  }

  public async getLastUserAction(request: LastUserActionRequest): Promise<LastUserActionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${URLS.lastUserAction}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          [HEADERS.authorization]: `Bearer ${request.accessToken}`,
        },
      });
      if (HttpRequest.isBadResponse(response)) {
        throw new Error("Bad response");
      }
      return response.json();
    } catch (e) {
      console.error("Error fetching using getLastUserAction", e);
      throw e;
    }
  }

  public async getAllTiles(): Promise<AllTilesResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${URLS.allTiles}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (HttpRequest.isBadResponse(response)) {
        throw new Error("Bad response");
      }
      return response.json();
    } catch (e) {
      console.error("Error fetching using getAllTiles", e);
      throw e;
    }
  }

  public static isBadResponse(response: Response): boolean {
    return response.status !== HTTP_STATUS.ok;
  }
}
