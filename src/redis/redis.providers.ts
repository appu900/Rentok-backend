import { Provider } from '@nestjs/common';
import * as IORedis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const redisProviders: Provider[] = [
  {
    provide: REDIS_CLIENT,
    useFactory: async () => {
      const client = new IORedis.Redis({
        host: 'localhost',
        port: 6379,
      });

      client.on('connect', () => {
        console.log('✅ Connected to Redis');
      });

      client.on('error', (err) => {
        console.error('❌ Redis error', err);
      });

      return client;
    },
  },
];



// 9238308912  
