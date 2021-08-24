import User from '../infra/typeorm/entities/User';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '../dtos/IFindAllProvidersDTO';

export default interface IUserRepository {
  /**
   * Cria um novo usuário
   * @param data DTO responsável pelos dados de cadastro
   */
  create(data: ICreateUserDTO): Promise<User>;

  /**
   * Atualiza as informações de um usuário já cadastrado
   * @param data usuário já cadastrado
   */
  save(data: User): Promise<User>;

  findByEmail(email: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;

  findAllProviders(data: IFindAllProvidersDTO): Promise<User[]>;
}
