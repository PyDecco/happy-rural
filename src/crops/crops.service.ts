import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  async create(createCropDto: CreateCropDto): Promise<Crop> {
    const { farmId, vegetationArea } = createCropDto;

    const farm = await this.farmRepository.findOne({ where: { id: farmId } });
    if (!farm) {
      throw new NotFoundException('Fazenda não encontrada');
    }

    await this.validateCropArea(farmId, vegetationArea);

    const crop = this.cropRepository.create({
      ...createCropDto,
      farm,
    });

    return this.cropRepository.save(crop);
  }

  async findAll(): Promise<Crop[]> {
    return this.cropRepository.find({ relations: ['farm','farm.producer'] });
  }

  async findOne(id: string): Promise<Crop> {
    const crop = await this.cropRepository.findOne({ where: { id }, relations: ['farm','farm.producer'] });
    if (!crop) {
      throw new NotFoundException('Safra não encontrada');
    }
    return crop;
  }

  async update(id: string, updateCropDto: UpdateCropDto): Promise<Crop> {
    const crop = await this.findOne(id);

    const { farmId, vegetationArea } = updateCropDto;

    if (farmId || vegetationArea !== undefined) {
      const farm = await this.farmRepository.findOne({ where: { id: crop.farm.id } });
      if (!farm) {
        throw new NotFoundException('Fazenda não encontrada');
      }

      // Validação da área considerando a atualização
      const adjustedVegetationArea = vegetationArea ?? crop.vegetationArea;
      await this.validateCropArea(farm.id, adjustedVegetationArea, id);
    }

    Object.assign(crop, updateCropDto);
    return this.cropRepository.save(crop);
  }

  async remove(id: string): Promise<void> {
    const crop = await this.findOne(id);
    await this.cropRepository.remove(crop);
  }

  private async validateCropArea(farmId: string, vegetationArea: number, excludeCropId?: string): Promise<void> {
    const farm = await this.farmRepository.findOne({ where: { id: farmId } });
    if (!farm) {
      throw new NotFoundException('Fazenda não encontrada');
    }

    const existingCrops = await this.cropRepository.find({ where: { farm: { id: farmId } } });


    const totalVegetationArea = existingCrops
      .filter((crop) => crop.id !== excludeCropId) 
      .reduce((sum, crop) => sum + crop.vegetationArea, 0);

    if (totalVegetationArea + vegetationArea + farm.agriculturalArea > farm.totalArea) {
      throw new BadRequestException('A área das culturas não pode ultrapassar a área total da fazenda');
    }
  }
}
