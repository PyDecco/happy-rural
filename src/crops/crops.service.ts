import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Crop } from './entities/crop.entity';
import { Farm } from '../farms/entities/farm.entity';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';

@Injectable()
export class CropsService {
  constructor(
    @InjectRepository(Crop) private cropRepository: Repository<Crop>,
    @InjectRepository(Farm) private farmRepository: Repository<Farm>,
  ) {}

  // Criar uma nova safra
  async create(createCropDto: CreateCropDto): Promise<Crop> {
    const { farmId, cropName, vegetationArea } = createCropDto;

    const farm = await this.farmRepository.findOne({ where: { id: farmId } });
    if (!farm) {
      throw new NotFoundException('Fazenda não encontrada');
    }

    const crop = this.cropRepository.create({
      ...createCropDto,
      farm,
    });

    return this.cropRepository.save(crop);
  }

  // Encontrar todas as safras
  async findAll(): Promise<Crop[]> {
    return this.cropRepository.find({ relations: ['farm'] });
  }

  // Encontrar uma safra pelo ID
  async findOne(id: string): Promise<Crop> {
    const crop = await this.cropRepository.findOne({ where: { id }, relations: ['farm'] });
    if (!crop) {
      throw new NotFoundException('Safra não encontrada');
    }
    return crop;
  }

  // Atualizar uma safra
  async update(id: string, updateCropDto: UpdateCropDto): Promise<Crop> {
    const crop = await this.cropRepository.findOne({ where: { id }, relations: ['farm'] });
    if (!crop) {
      throw new NotFoundException('Safra não encontrada');
    }

    Object.assign(crop, updateCropDto);
    return this.cropRepository.save(crop);
  }

  // Remover uma safra
  async remove(id: string): Promise<void> {
    const crop = await this.cropRepository.findOne({ where: { id } });
    if (!crop) {
      throw new NotFoundException('Safra não encontrada');
    }
    await this.cropRepository.remove(crop);
  }
}
