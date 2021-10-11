import { container } from 'tsyringe';
import RedisCacheProvider from './impl/RedisCacheProvider';

const providers = {
  redis: RedisCacheProvider,
};

container.registerSingleton('CacheProvider', providers.redis);
