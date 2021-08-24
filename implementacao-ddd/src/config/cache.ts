import { RedisOptions } from 'ioredis';

interface ICacheConfig {
  driver: 'redis';
  config: {
    redis: RedisOptions;
  };
}

export default {
  driver: 'redis',
  config: {
    redis: {
      host: process.env.REDIS_URL,
      port: Number(process.env.REDIS_PORT),
      username: process.env.REDIS_USER ?? undefined,
      password: process.env.REDIS_PASSWORD ?? undefined,
    },
  },
} as ICacheConfig;
