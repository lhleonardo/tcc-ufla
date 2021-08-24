import AppError from '@shared/errors/AppError';
import { NextFunction, Request, Response } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';

import redis from 'redis';

const redisClient = redis.createClient({
  host: process.env.REDIS_URL,
  port: Number(process.env.REDIS_PORT),

  password: process.env.REDIS_PASSWORD || undefined,
  enable_offline_queue: false,
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rate-limiter',
  points: 10, // 10 requests
  duration: 1, // per 1 second by IP
});

const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await limiter.consume(req.ip);

    return next();
  } catch (error) {
    console.log(error);
    throw new AppError(
      'Muitas requisições simultâneas. Não sobrecarregue o servidor.',
      429,
    );
  }
};

export default rateLimiter;
