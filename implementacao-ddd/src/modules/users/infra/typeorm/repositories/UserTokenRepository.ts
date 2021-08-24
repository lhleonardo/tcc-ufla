import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository';
import UserToken from '../entities/UserToken';
import { Repository, getRepository } from 'typeorm';
import AppError from '@shared/errors/AppError';

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
