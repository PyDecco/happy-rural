import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProducersService } from './producers.service';
import { ProducersController } from './producers.controller';
import { Producer } from './entities/producer.entity';
import { ProducersRepository } from './producers.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Producer, ProducersRepository])],
  controllers: [ProducersController],
  providers: [ProducersService, ProducersRepository],
  exports: [ProducersService],
})
export class ProducersModule {}
