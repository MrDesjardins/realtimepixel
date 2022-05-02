export class AuthRepository {
  private fakeRepository: Map<string, string>; //Email -> Hashed Password

  public constructor() {
    this.fakeRepository = new Map<string, string>();

    // Fake account (test/test)
    this.fakeRepository.set(
      "test",
      "$2b$10$rx9NrjdGk4WJ.f8cUUvr0eYdoFl8aHe6VCyZ6M.4RPBoJF45z2eZK"
    );
  }

  public async getUserHashPassword(email: string): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        if (this.fakeRepository.has(email)) {
          return resolve(this.fakeRepository.get(email));
        }
        reject("Wrong email/password");
      }, 500);
    });
  }

  public async createUser(email: string, password: string): Promise<void> {
    if (this.fakeRepository.has(email)) {
      throw new Error("User already exists");
    }
    return new Promise((resolve) => {
      setTimeout(async () => {
        this.fakeRepository.set(email, password);
        resolve();
      }, 500);
    });
  }
}
