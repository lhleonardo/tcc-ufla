import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';
import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';
import { inject, injectable } from 'tsyringe';

@injectable()
class ListProviderServices {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    excludeUserId,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let providers = await this.cacheProvider.recovery<User[]>(
      `list-providers:${excludeUserId}`,
    );
    if (!providers) {
      providers = classToClass(
        await this.userRepository.findAllProviders({
          excludeUserId,
        }),
      );

      await this.cacheProvider.save(
        `list-providers:${excludeUserId}`,
        providers,
      );
    }

    return providers;
  }
}

export default ListProviderServices;
