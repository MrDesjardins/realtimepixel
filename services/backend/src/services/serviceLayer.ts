import { ServiceEnvironment } from "@shared/constants/backend";
import { LoginService } from "./loginService";

/**
 * Contains the aggregation of all the services that the web server can communicate with.
 **/
export class ServiceLayer {
  private loginService: LoginService;
  public constructor(private environment: ServiceEnvironment) {
    this.loginService = new LoginService(this.environment);
  }

  public get login(): LoginService {
    return this.loginService;
  }
}
