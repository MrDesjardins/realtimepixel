import { ServiceEnvironment } from "@shared/constants/backend";
import { CONST_RULES } from "@shared/constants/rules";
import { Token } from "../../../shared/models/primitive";
import { BaseService } from "./baseService";
export class UserService extends BaseService {
  public constructor(environment: ServiceEnvironment) {
    super(environment);
  }

  public getLastUserAction(
    userEmail: string
  ): Promise<EpochTimeStamp | undefined> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(new Date().getTime() - CONST_RULES.userPixelDelaySeconds);
        //***
        //***
        //*** Here is the rule we need to do:
        //*** 1) If the user token invalid = undefined
        //*** 2) If user token valid + found, return the timestamp
        //*** 3) If user token valid + not found, return a timestamp from the past that allows an action for the user to be performed
      }, 3000);
    });
  }
}
