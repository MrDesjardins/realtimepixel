import { ServiceEnvironment } from "@shared/constants/backend";
import { LoginRequest } from "@shared/models/login";
import { BaseService } from "./baseService";
export class LoginService extends BaseService {
  public constructor(environment: ServiceEnvironment) {
    super(environment);
  }

  /**
   * Goal is to get a valid token which is only possible for a valid user.
   *
   * @returns String with a valid token if the user is not valid, rejection (exception) otherwise.
   **/
  public authenticate(loginRequest: LoginRequest): Promise<string> {
    console.log("Main123");
    return new Promise((resolve, reject) => {
      console.log("Main");
      setTimeout(() => {
        if (loginRequest.email === "test" && loginRequest.password === "test") {
          resolve("test_token");
        } else {
          console.log("Main2");
          reject("Wrong email/password");
        }
      }, 500);
    });
  }
}
