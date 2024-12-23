import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farm } from '../entities/farm.entity';
import { Crop } from '../entities/crop.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Farm)
    private readonly farmRepository: Repository<Farm>,
    @InjectRepository(Crop)
    private readonly cropRepository: Repository<Crop>,
  ) {}

  async getOverview(producerId: string) {
    const query = this.farmRepository.createQueryBuilder('farm')
      .select('COUNT(farm.id)', 'totalFarms')
      .addSelect('SUM(farm.totalArea)', 'totalArea')
      .where('farm.producerId = :producerId', { producerId });

    return query.getRawOne();
  }

  async getFarmsByState(producerId: string) {
    const query = this.farmRepository.createQueryBuilder('farm')
      .select('farm.state', 'state')
      .addSelect('COUNT(farm.id)', 'total')
      .where('farm.producerId = :producerId', { producerId })
      .groupBy('farm.state');

    return query.getRawMany();
  }

  async getCropsByType(producerId: string) {
    const query = this.cropRepository.createQueryBuilder('crop')
      .leftJoin('crop.farm', 'farm')
      .select('crop.cropName', 'cropName')
      .addSelect('COUNT(crop.id)', 'total')
      .where('farm.producerId = :producerId', { producerId })
      .groupBy('crop.cropName');

    return query.getRawMany();
  }

  async getLandUsage(producerId: string) {
    const query = this.farmRepository.createQueryBuilder('farm')
      .leftJoin('farm.crops', 'crop')
      .select('SUM(farm.agriculturalArea)', 'totalAgriculturalArea')
      .addSelect('SUM(crop.vegetationArea)', 'totalVegetationArea')
      .where('farm.producerId = :producerId', { producerId });

    return query.getRawOne();
  }  
}
