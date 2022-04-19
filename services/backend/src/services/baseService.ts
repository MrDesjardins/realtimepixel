import { ServiceEnvironment } from "@shared/constants/backend";

export abstract class BaseService {
  protected constructor(protected environment: ServiceEnvironment) {
    this.environment = environment;
  }
}
