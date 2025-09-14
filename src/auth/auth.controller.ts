import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterPropertyOwnerDTO } from './dto/PropertyOwner.dto';
import { Role } from '@prisma/client';
import { UserLoginDto } from './dto/userLogin.dto';
import { AuthenticationOTPRequestDTO } from './dto/authOTP.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  async loginUser(@Body() payload:AuthenticationOTPRequestDTO) {
    return await this.authService.handleSendOTP(payload.phoneNumber)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() payload: UserLoginDto) {
    return this.authService.handleLogin(payload)
  }

  @Post('property-owner/register')
  @HttpCode(HttpStatus.CREATED)
  async registerPropertyOwner(@Body() payload: RegisterPropertyOwnerDTO) {
    console.log(payload);
    return this.authService.createPropertyOwner(payload, Role.PROPERTY_OWNER);
  }
}
