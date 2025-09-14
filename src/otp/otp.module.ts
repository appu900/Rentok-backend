import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { HttpModule, HttpService } from '@nestjs/axios';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [HttpModule,RedisModule],
  providers: [OtpService],
  controllers: [OtpController],
  exports: [OtpService],
})
export class OtpModule {}
