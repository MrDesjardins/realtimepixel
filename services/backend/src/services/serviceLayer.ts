import { ServiceEnvironment } from "@shared/constants/backend";
import { LoginService } from "./loginService";
import { UserService } from "./userService";

/**
 * Contains the aggregation of all the services that the web server can communicate with.
 **/
export class ServiceLayer {
  private loginService: LoginService;
  private userService: UserService;
  public constructor(private environment: ServiceEnvironment) {
    this.loginService = new LoginService(this.environment);
    this.userService = new UserService(this.environment);
  }

  public get login(): LoginService {
    return this.loginService;
  }

  public get user(): UserService {
    return this.userService;
  }
}
