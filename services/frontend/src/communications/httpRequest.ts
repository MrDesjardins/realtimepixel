import { UserLoginRequest, UserLoginResponse } from "@shared/models/login";
import { LastUserActionRequest, LastUserActionResponse } from "@shared/models/user";
import { HEADERS, URLS } from "@shared/constants/backend";
import { ENV_VARIABLES } from "../generated/constants_env";

export class HttpRequest {
  private baseUrl: string = "";
  public constructor() {
    this.baseUrl = `http://${ENV_VARIABLES.SERVER_IP}:${ENV_VARIABLES.DOCKER_SERVER_PORT_FORWARD}`;
  }

  public async login(loginRequest: UserLoginRequest): Promise<UserLoginResponse> {
    const response = await fetch(`${this.baseUrl}/${URLS.login}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginRequest),
    });

    return response.json();
  }

  public async getLastUserAction(request: LastUserActionRequest): Promise<LastUserActionResponse> {
    const response = await fetch(`${this.baseUrl}/${URLS.lastUserAction}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        [HEADERS.access_token]: request.token,
      },
    });

    return response.json();
  }
}
