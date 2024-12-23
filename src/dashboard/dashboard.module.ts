import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Farm } from '../entities/farm.entity';
import { Crop } from '../entities/crop.entity';
import { Producer } from '../entities/producer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Farm, Crop, Producer])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
