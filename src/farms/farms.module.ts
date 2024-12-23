import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { FarmsController } from './farms.controller';
import { FarmsService } from './farms.service';
import { Farm } from './entities/farm.entity'; 
import { Crop } from '../crops/entities/crop.entity'; 
import { ProducersModule } from '../producers/producers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Farm, Crop]), 
    ProducersModule
  ],
  controllers: [FarmsController], 
  providers: [FarmsService], 
})
export class FarmsModule {}
