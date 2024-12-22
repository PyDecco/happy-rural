import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProducerDto } from './dto/create-producer.dto';
import { PaginationDto } from 'src/core/dto/pagination.dto';
import { ProducersRepository } from './producers.repository';
import { UpdateProducerDto } from './dto/update-producer.dto';

@Injectable()
export class ProducersService {
  constructor(private readonly producersRepository: ProducersRepository) {}

  async create(createProducerDto: CreateProducerDto) {
    const producer = await this.producersRepository.findOne({ where: { cpfOrCnpj: createProducerDto.cpfOrCnpj } }); 
    if (producer){
      throw new ConflictException('Produtor já cadastrado');
    }
    return this.producersRepository.created(createProducerDto);
  }

  findAll(paginationDto: PaginationDto) {
    const {page, limit} = paginationDto;
    const skip = (page - 1) * limit;
    return this.producersRepository.findAll({ skip, take: limit });
  }

  findOne(id: string) {
    return this.producersRepository.findOneById(id);
  }

  async remove(id: string) {
    const producer = await this.producersRepository.findOne({ where: { id: id } }); 
    if (!producer){
      throw new NotFoundException('Produtor não encontrado !');
    }
    return this.producersRepository.removed(id);
  }

  update(id: string, updateData: UpdateProducerDto) {
    return this.producersRepository.updated(id, updateData);
  }
}

