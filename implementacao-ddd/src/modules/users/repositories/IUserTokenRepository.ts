import UserToken from '../infra/typeorm/entities/UserToken';

export default interface IUserTokenRepository {
  generate(userId: string): Promise<UserToken>;
  getByToken(token: string): Promise<UserToken | undefined>;
}
