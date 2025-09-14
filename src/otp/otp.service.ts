import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  constructor(
    private redisService: RedisService,
    private readonly httpService: HttpService,
  ) {}
  async generateOTP(
    phoneNumber: string,
  ): Promise<{ otp: string; expiredIn: number }> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiredIn = 120;
    await this.redisService.set(phoneNumber,otp,expiredIn)
    return { otp, expiredIn };
  }

  async sendOTP(phoneNumber: string, otp: string) {
    try {
      const templateid = '1007161519960183117';
      const message = `Dear User, Your OTP for login is: ${otp} With Regards, GTIDS IT Team`;
      const checkSavedOTP = await this.redisService.get(phoneNumber)
      if(checkSavedOTP){
       await this.redisService.del(phoneNumber)
      }
      const smsurl = `https://smslogin.co/v3/api.php?username=gramtarang&apikey=2279de0891389c8d3a33&senderid=GTIDSP&templateid=${templateid}&mobile=${phoneNumber}&message=${encodeURIComponent(
        message,
      )}`;
      const response = await this.httpService.axiosRef.post(smsurl);
      await this.redisService.set(phoneNumber,otp);
      console.log(response.data);
      this.logger.log('OTP SENT', response);
      return response.data;
    } catch (error) {
      this.logger.error('failed to send otp');
      throw new Error('Something went wrong in sending OTP');
    }
  }

  async verifyOTP(phoneNumber: string, providedOTP: string): Promise<boolean> {
    const storedOTP = await this.redisService.get(phoneNumber);
    console.log(storedOTP)
    if (!storedOTP) {
      throw new BadRequestException('OTP expired');
    }
    if (String(storedOTP) === providedOTP) {
      await this.redisService.del(phoneNumber)
      return true;
    }

    return false;
  }
}
