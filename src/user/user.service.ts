import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcryptjs';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async getByPhoneNumber(phoneNumber: string) {
    return await this.prisma.user.findUnique({
      where: { phoneNumber },
    });
  }

  async getByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
  }

  async createPropertyOwner(
    phoneNumber: string,
    name: string,
    password: string,
    email: string,
    ownershipType: string,
  ) {
    const hasedPassword = await hash(password, 10);
    const propertOwner = await this.prisma.user.create({
      data: {
        phoneNumber: phoneNumber,
        passwordHash: hasedPassword,
        email: email,
        name: name,
        role: Role.PROPERTY_OWNER,
        propertyOwnerProfile: {
          create: {
            ownershipType: ownershipType,
          },
        },
      },
    });
    return propertOwner
  }
}
