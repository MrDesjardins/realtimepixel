import { ServiceEnvironment } from "@shared/constants/backend";
import { AuthService } from "./authService";
import { GameService } from "./gameService";
import { UserService } from "./userService";

/**
 * Contains the aggregation of all the services that the web server can communicate with.
 **/
export class ServiceLayer {
  private loginService: AuthService;
  private userService: UserService;
  private gameService: GameService;
  public constructor(private environment: ServiceEnvironment) {
    this.loginService = new AuthService(this.environment);
    this.userService = new UserService(this.environment);
    this.gameService = new GameService(this.environment);
  }

  public get auth(): AuthService {
    return this.loginService;
  }

  public get user(): UserService {
    return this.userService;
  }

  public get game(): GameService {
    return this.gameService;
  }
}
