import IHashProvider from '../models/IHashProvider';

class FakeHashProvider implements IHashProvider {
  async generateHash(payload: string): Promise<string> {
    return payload;
  }
  async compare(payload: string, hashed: string): Promise<boolean> {
    return payload === hashed;
  }
}

export default FakeHashProvider;
