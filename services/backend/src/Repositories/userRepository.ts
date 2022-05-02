export class UserRepository {
  private fakeRepository: Map<string, EpochTimeStamp>; //Email -> Last time

  public constructor() {
    this.fakeRepository = new Map<string, EpochTimeStamp>();
  }
  public async getLastUserAction(
    email: string
  ): Promise<EpochTimeStamp | undefined> {
    return Promise.resolve(this.fakeRepository.get(email));
  }

  public async setLastUserAction(
    userEmail: string,
    time: number
  ): Promise<void> {
    this.fakeRepository.set(userEmail, time);
  }
}
