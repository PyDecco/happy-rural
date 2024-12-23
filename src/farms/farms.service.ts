import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farm } from './entities/farm.entity';
import { Crop } from '../crops/entities/crop.entity';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { ProducersService } from '../producers/producers.service';

@Injectable()
export class FarmsService {
  constructor(
    @InjectRepository(Farm) private farmRepository: Repository<Farm>,
    @InjectRepository(Crop) private cropRepository: Repository<Crop>,
    private readonly producersService: ProducersService,
  ) {}

  async createFarm(createFarmDto: CreateFarmDto): Promise<Farm> {
    const crops: Crop[] = [];
    const producer = await this.producersService.findOne(createFarmDto.producerId) 
    const farm = this.farmRepository.create({ ...createFarmDto, crops, producer });
  
    return this.farmRepository.save(farm);
  }  

  async findAll(): Promise<Farm[]> {
    return this.farmRepository.find({ relations: ['crops','producer'] });
  }

  async findOne(id: string): Promise<Farm> {
    const farm = await this.farmRepository.findOne({ where: { id }, relations: ['crops','producer'] });
    if (!farm) {
      throw new NotFoundException('Fazenda não encontrada');
    }
    return farm;
  }

  async updateFarm(id: string, updateFarmDto: UpdateFarmDto): Promise<Farm> {
    const crops = await this.cropRepository.findByIds(updateFarmDto.crops || []);
    const producer = await this.producersService.findOne(updateFarmDto.producerId);
  
    const farm = await this.farmRepository.preload({
      id,
      ...updateFarmDto,
      crops,
      producer,
    });
  
    if (!farm) {
      throw new NotFoundException('Fazenda não encontrada para atualizar');
    }
  
    return this.farmRepository.save(farm);
  }

  async remove(id: string): Promise<void> {
    const farm = await this.findOne(id);
    await this.farmRepository.remove(farm);
  }
}
