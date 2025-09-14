import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterPropertyOwnerDTO } from './dto/PropertyOwner.dto';
import { Role, User } from '@prisma/client';
import { UserLoginDto } from './dto/userLogin.dto';
import { OtpService } from 'src/otp/otp.service';
import { RedisService } from 'src/redis/redis.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly otpService: OtpService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
  ) {}

  private async generateToken(user: User) {
    const payload = { sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async createPropertyOwner(payload: RegisterPropertyOwnerDTO, role: Role) {
    const userExists = await this.userService.getByPhoneNumber(
      payload.phoneNumber,
    );
    if (userExists) throw new ConflictException('user already exists');
    return await this.userService.createPropertyOwner(
      payload.phoneNumber,
      payload.name,
      payload.password,
      payload.email,
      payload.ownershipType,
    );
  }

  async handleSendOTP(phoneNumber: string) {
    const otpObj = await this.otpService.generateOTP(phoneNumber);
    return this.otpService.sendOTP(phoneNumber, otpObj.otp);
  }

  async checkOTP() {
    return await this.redisService.get('7735041901');
  }

  async handleLogin(payload: UserLoginDto) {
    const isOtpTrue = await this.otpService.verifyOTP(
      payload.phoneNumber,
      payload.otp,
    );
    if (!isOtpTrue) {
      throw new UnauthorizedException('invalid otp');
    }
    const user = await this.userService.getByPhoneNumber(payload.phoneNumber);
    if (!user) {
      throw new NotFoundException('User not found with this phoneNumber');
    }

    const token = await this.generateToken(user);
    return {
      userName: user.name,
      email: user.email,
      role: user.role,
      ...token
    };
  }
}
