interface TokenTableSchema {
  accessToken: string;
  refreshToken: string;
}
export class TokenRepository {
  private fakeTokenRepository: Map<string, TokenTableSchema>; //Email -> Tokens (access + refrehs)
  public constructor() {
    this.fakeTokenRepository = new Map<string, TokenTableSchema>();
  }

  public async hasToken(email: string): Promise<boolean> {
    return Promise.resolve(this.fakeTokenRepository.has(email));
  }

  public async getToken(email: string): Promise<TokenTableSchema | undefined> {
    return Promise.resolve(this.fakeTokenRepository.get(email));
  }

  public async removeToken(email: string): Promise<void> {
    this.fakeTokenRepository.delete(email);
    return Promise.resolve();
  }

  public async updateTokens(
    email: string,
    accessToken: string,
    refreshToken: string
  ): Promise<void> {
    this.fakeTokenRepository.set(email, {
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
    return Promise.resolve();
  }
}
