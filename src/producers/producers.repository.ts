import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Producer } from './entities/producer.entity';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { NotFoundError } from 'rxjs';

@Injectable()
export class ProducersRepository extends Repository<Producer> {
  constructor(private readonly dataSource: DataSource) {
    super(Producer, dataSource.createEntityManager());
  }

  async created(createProducerDto: CreateProducerDto): Promise<Producer> {
    const producer = this.create(createProducerDto);
    return this.save(producer);
  }

  async findAll({ skip, take }: { skip: number; take: number }): Promise<Producer[]> {
    return this.find({
      skip,
      take,
    });
  }

  async findOneById(id: string): Promise<Producer | null> {
    return this.findOne({ where: { id }, relations: ['farms'] });
  }

  async updated(id: string, updateProducerDto: UpdateProducerDto): Promise<Producer | null> {
    const producer = await this.preload({
      id,
      ...updateProducerDto,
    });

    if (!producer) {
      throw new NotFoundException('Produtor não encontrado para atualizar');
    }

    return this.save(producer);
  }

  async removed(id: string): Promise<void> {
    await this.delete(id);
  }
}
