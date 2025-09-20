import { Module } from '@nestjs/common';
import { PropertyOwnerService } from './property-owner.service';
import { PropertyOwnerController } from './property-owner.controller';

@Module({
  providers: [PropertyOwnerService],
  controllers: [PropertyOwnerController]
})
export class PropertyOwnerModule {}
