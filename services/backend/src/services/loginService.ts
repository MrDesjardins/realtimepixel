import { ServiceEnvironment } from "@shared/constants/backend";
import { CreateUserRequest, UserLoginRequest } from "@shared/models/login";
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
  public authenticate(request: UserLoginRequest): Promise<string> {
    console.log("authenticate");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (request.email === "test" && request.password === "test") {
          resolve("test_token");
        } else {
          console.log("Main2");
          reject("Wrong email/password");
        }
      }, 500);
    });
  }

  public create(request: CreateUserRequest): Promise<string> {
    console.log("create");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("test_token");
        //reject("Already an account on this email");
      }, 500);
    });
  }
}
