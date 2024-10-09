import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { Feature } from './entities/feature.entity';
import { FloorPlan } from './entities/floor-plan.entity';
import { FeatureController } from './feature/feature.controller';
import { FeatureService } from './feature/feature.service';
import { PropertyFeature } from './entities/property-feature.entity';
import { FloorPlanController } from './floor-plan/floor-plan.controller';
import { FloorPlanService } from './floor-plan/floor-plan.service';
import { StorageFileModule } from '../storage-file/storage-file.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Property, Feature, FloorPlan, PropertyFeature]),
    StorageFileModule,
    UserModule,
  ],
  controllers: [PropertyController, FeatureController, FloorPlanController],
  providers: [PropertyService, FeatureService, FloorPlanService],
})
export class PropertyModule {}
