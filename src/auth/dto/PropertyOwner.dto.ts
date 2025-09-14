import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterPropertyOwnerDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  ownershipType: string;
}
