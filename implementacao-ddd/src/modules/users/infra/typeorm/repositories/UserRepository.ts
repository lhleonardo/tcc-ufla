import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '../entities/User';
import { Repository, getRepository, Not } from 'typeorm';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

class UserRepository implements IUserRepository {
  private ormRepository: Repository<User>;
  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async create(data: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(data);
    await this.ormRepository.save(user);

    return user;
  }

  public save(data: User): Promise<User> {
    return this.ormRepository.save(data);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ where: { email } });

    return user;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);

    return user;
  }

  public async findAllProviders({
    excludeUserId,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let users: User[];
    if (excludeUserId) {
      users = await this.ormRepository.find({
        where: {
          id: Not(excludeUserId),
        },
      });
    } else {
      users = await this.ormRepository.find();
    }

    return users;
  }
}

export default UserRepository;
