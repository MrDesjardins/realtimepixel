import { LoginRequest, LoginResponse } from "@shared/models/login";
import { ENV_VARIABLES } from "../generated/constants_env";
export function login(login: LoginRequest): LoginResponse {
  return { email: "", timestamp: 0, token: "" };
}

export class HttpRequest {
  private baseUrl: string = "";
  public constructor() {
    this.baseUrl = `http://${ENV_VARIABLES.SERVER_IP}:${ENV_VARIABLES.DOCKER_SERVER_PORT_FORWARD}`;
  }

  public async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginRequest),
    });

    return response.json();
  }
}
