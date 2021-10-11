import UserToken from '@models/UserToken';
import IUserTokenRepository from '@repositories/IUserTokenRepository';
import { getRepository, Repository } from 'typeorm';

export default class UserTokenRepository implements IUserTokenRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = getRepository(UserToken);
  }
  async generate(userId: string): Promise<UserToken> {
    const token = this.ormRepository.create({ userId });

    await this.ormRepository.save(token);

    return token;
  }
  async getByToken(token: string): Promise<UserToken | undefined> {
    const intent = await this.ormRepository.findOne({ where: { token } });

    return intent;
  }
}
