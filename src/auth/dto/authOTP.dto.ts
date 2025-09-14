import { IsNotEmpty } from 'class-validator';

export class AuthenticationOTPRequestDTO {
  @IsNotEmpty()
  phoneNumber: string;
}
