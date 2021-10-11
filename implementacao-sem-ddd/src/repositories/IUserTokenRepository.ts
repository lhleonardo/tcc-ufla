import UserToken from '@models/UserToken';

export default interface IUserTokenRepository {
  generate(userId: string): Promise<UserToken>;
  getByToken(token: string): Promise<UserToken | undefined>;
}
