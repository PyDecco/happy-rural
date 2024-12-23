import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Farm } from '../farms/entities/farm.entity';
import { Crop } from '../crops/entities/crop.entity';

describe('DashboardService', () => {
  let service: DashboardService;
  let farmRepository: Repository<Farm>;
  let cropRepository: Repository<Crop>;

  // Mock do QueryBuilder
  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    getRawOne: jest.fn(),
    getRawMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: getRepositoryToken(Farm),
          useValue: {
            createQueryBuilder: jest.fn(() => mockQueryBuilder),
          },
        },
        {
          provide: getRepositoryToken(Crop),
          useValue: {
            createQueryBuilder: jest.fn(() => mockQueryBuilder),
          },
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    farmRepository = module.get<Repository<Farm>>(getRepositoryToken(Farm));
    cropRepository = module.get<Repository<Crop>>(getRepositoryToken(Crop));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOverview', () => {
    it('should return the total farms and total area', async () => {
      const mockResult = { totalFarms: '3', totalArea: '1500' };
      mockQueryBuilder.getRawOne.mockResolvedValue(mockResult);

      const result = await service.getOverview('producer-id');
      expect(result).toEqual(mockResult);
      expect(farmRepository.createQueryBuilder).toHaveBeenCalledWith('farm');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('farm.producerId = :producerId', { producerId: 'producer-id' });
    });
  });

  describe('getFarmsByState', () => {
    it('should return the farms grouped by state', async () => {
      const mockResult = [
        { state: 'SP', total: '2' },
        { state: 'MG', total: '1' },
      ];
      mockQueryBuilder.getRawMany.mockResolvedValue(mockResult);

      const result = await service.getFarmsByState('producer-id');
      expect(result).toEqual(mockResult);
      expect(farmRepository.createQueryBuilder).toHaveBeenCalledWith('farm');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('farm.producerId = :producerId', { producerId: 'producer-id' });
    });
  });

  describe('getCropsByType', () => {
    it('should return the crops grouped by type', async () => {
      const mockResult = [
        { cropName: 'Soybean', total: '4' },
        { cropName: 'Corn', total: '2' },
      ];
      mockQueryBuilder.getRawMany.mockResolvedValue(mockResult);

      const result = await service.getCropsByType('producer-id');
      expect(result).toEqual(mockResult);
      expect(cropRepository.createQueryBuilder).toHaveBeenCalledWith('crop');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('farm.producerId = :producerId', { producerId: 'producer-id' });
    });
  });

  describe('getLandUsage', () => {
    it('should return the land usage data', async () => {
      const mockResult = {
        totalAgriculturalArea: '1000',
        totalVegetationArea: '500',
      };
      mockQueryBuilder.getRawOne.mockResolvedValue(mockResult);

      const result = await service.getLandUsage('producer-id');
      expect(result).toEqual(mockResult);
      expect(farmRepository.createQueryBuilder).toHaveBeenCalledWith('farm');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('farm.producerId = :producerId', { producerId: 'producer-id' });
    });
  });
});
