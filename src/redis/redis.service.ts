import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from './redis.providers';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async onModuleDestroy() {
    await this.redis.quit();
    this.logger.log('Redis connection closed');
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const serializedValue =
      typeof value === 'string' ? value : JSON.stringify(value);

    if (ttlSeconds) {
      await this.redis.setex(key, ttlSeconds, serializedValue);
      this.logger.debug(`SET ${key} = ${serializedValue} (TTL: ${ttlSeconds}s)`);
    } else {
      await this.redis.set(key, serializedValue);
      this.logger.debug(`SET ${key} = ${serializedValue}`);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    this.logger.debug(`GET ${key} = ${value}`);

    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }

  async del(key: string): Promise<number> {
    const result = await this.redis.del(key);
    this.logger.debug(`DEL ${key} (deleted: ${result})`);
    return result;
  }
}
