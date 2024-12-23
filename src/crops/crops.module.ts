import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CropsService } from './crops.service';
import { CropsController } from './crops.controller';
import { Crop } from './entities/crop.entity';
import { Farm } from '../farms/entities/farm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Crop, Farm])],
  controllers: [CropsController],
  providers: [CropsService],
})
export class CropsModule {}
