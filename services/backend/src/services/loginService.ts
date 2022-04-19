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
   * @returns String with a valid token or undefined if the user is not valid.
   **/
  public authenticate(loginRequest: LoginRequest): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (loginRequest.email === "test" && loginRequest.password === "test") {
          resolve("test_token");
        } else {
          reject("Wrong email/password");
        }
      });
    });
  }
}
