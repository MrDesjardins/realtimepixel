import { UserLoginRequest, UserLoginResponse } from "@shared/models/login";
import { LastUserActionRequest, LastUserActionResponse } from "@shared/models/user";
import { HEADERS, HTTP_STATUS, URLS } from "@shared/constants/backend";
import { ENV_VARIABLES } from "../generated/constants_env";

export class HttpRequest {
  private baseUrl: string = "";
  public constructor() {
    this.baseUrl = `http://${ENV_VARIABLES.SERVER_IP}:${ENV_VARIABLES.DOCKER_SERVER_PORT_FORWARD}`;
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

      return response.json();
    } catch (e) {
      console.error("Error login", e);
      throw e;
    }
  }

  public async getLastUserAction(request: LastUserActionRequest): Promise<LastUserActionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${URLS.lastUserAction}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          [HEADERS.authorization]: `Bearer ${request.token}`,
        },
      });
      if (this.isBadResponse(response)) {
        throw new Error("Bad response");
      }
      return response.json();
    } catch (e) {
      console.error("Error fetching using getLastUserAction", e);
      throw e;
    }
  }

  private isBadResponse(response: Response): boolean {
    return response.status === HTTP_STATUS.token_missing || response.status === HTTP_STATUS.token_invalid;
  }
}
