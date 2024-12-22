import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producer } from './entities/producer.entity';
import { CreateProducerDto } from './dto/create-producer.dto';

@Injectable()
export class ProducersService {
  constructor(
    @InjectRepository(Producer)
    private producersRepository: Repository<Producer>,
  ) {}

  create(createProducerDto: CreateProducerDto) {
    const producer = this.producersRepository.create(createProducerDto);
    return this.producersRepository.save(producer);
  }

  findAll() {
    return this.producersRepository.find({ relations: ['farms'] });
  }

  findOne(id: string) {
    return this.producersRepository.findOne({ where: { id }, relations: ['farms'] });
  }

  remove(id: string) {
    return this.producersRepository.delete(id);
  }
}

