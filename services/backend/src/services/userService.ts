import { ServiceEnvironment } from "@shared/constants/backend";
import { CONST_RULES } from "@shared/constants/rules";
import { UserRepository } from "../Repositories/userRepository";
import { BaseService } from "./baseService";
export class UserService extends BaseService {
  private userRepository: UserRepository;
  public constructor(environment: ServiceEnvironment) {
    super(environment);
    this.userRepository = new UserRepository();
  }

  public async getLastUserAction(
    userEmail: string
  ): Promise<EpochTimeStamp | undefined> {
    const lastUserAction = await this.userRepository.getLastUserAction(
      userEmail
    );

    if (lastUserAction === undefined) {
      return Promise.resolve(
        new Date().getTime() - CONST_RULES.userPixelDelaySeconds
      );
    } else {
      return Promise.resolve(lastUserAction);
    }
  }
}
