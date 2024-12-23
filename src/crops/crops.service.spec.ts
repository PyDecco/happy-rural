import { Test, TestingModule } from '@nestjs/testing';
import { CropsService } from './crops.service';
import { Repository } from 'typeorm';
import { Crop } from './entities/crop.entity';
import { Farm } from '../farms/entities/farm.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CropsService', () => {
  let service: CropsService;
  let cropRepository: Repository<Crop>;
  let farmRepository: Repository<Farm>;

  const mockFarm = { id: 'farm1', totalArea: 100, agriculturalArea: 20 };
  const mockCrop = {
    id: '1',
    cropName: 'Corn',
    vegetationArea: 10,
    farm: mockFarm,
  };

  const mockCropRepository = {
    create: jest.fn().mockReturnValue(mockCrop),
    save: jest.fn().mockResolvedValue(mockCrop),
    find: jest.fn().mockResolvedValue([mockCrop]),
    findOne: jest.fn().mockResolvedValue(mockCrop),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  const mockFarmRepository = {
    findOne: jest.fn().mockResolvedValue(mockFarm),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CropsService,
        {
          provide: getRepositoryToken(Crop),
          useValue: mockCropRepository,
        },
        {
          provide: getRepositoryToken(Farm),
          useValue: mockFarmRepository,
        },
      ],
    }).compile();

    service = module.get<CropsService>(CropsService);
    cropRepository = module.get<Repository<Crop>>(getRepositoryToken(Crop));
    farmRepository = module.get<Repository<Farm>>(getRepositoryToken(Farm));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a crop', async () => {
      const dto = { cropName: 'Corn', farmId: 'farm1', vegetationArea: 10 } as any;
      const result = await service.create(dto);
      expect(result).toEqual(mockCrop);
      expect(farmRepository.findOne).toHaveBeenCalledWith({ where: { id: 'farm1' } });
      expect(cropRepository.save).toHaveBeenCalledWith(mockCrop);
    });

    it('should throw NotFoundException if farm is not found', async () => {
      (farmRepository.findOne as jest.Mock).mockResolvedValueOnce(null);
      await expect(service.create({ farmId: 'farm1', vegetationArea: 10 } as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all crops', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockCrop]);
      expect(cropRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single crop', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockCrop);
      expect(cropRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' }, relations: ['farm', 'farm.producer'] });
    });

    it('should throw NotFoundException if crop is not found', async () => {
      mockCropRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a crop', async () => {
      const dto = { cropName: 'Updated Corn' } as any;
      const result = await service.update('1', dto);
      expect(result).toEqual(mockCrop);
      expect(cropRepository.save).toHaveBeenCalledWith(mockCrop);
    });
  });

  describe('remove', () => {
    it('should remove a crop', async () => {
      const result = await service.remove('1');
      expect(result).toBeUndefined();
      expect(cropRepository.remove).toHaveBeenCalledWith(mockCrop);
    });
  });
});
