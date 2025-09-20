import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { OtpModule } from './otp/otp.module';
import { RedisModule } from './redis/redis.module';
import { PropertyOwnerModule } from './property-owner/property-owner.module';
import redisConfig from './config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule,
    AuthModule,
    UserModule,
    OtpModule,
    PropertyOwnerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
