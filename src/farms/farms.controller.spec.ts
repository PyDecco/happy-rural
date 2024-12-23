import { Test, TestingModule } from '@nestjs/testing';
import { FarmsController } from './farms.controller';
import { FarmsService } from './farms.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

const mockFarmsService = {
  createFarm: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  updateFarm: jest.fn(),
  remove: jest.fn(),
};

describe('FarmsController', () => {
  let controller: FarmsController;
  let service: FarmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FarmsController],
      providers: [
        { provide: FarmsService, useValue: mockFarmsService },
      ],
    }).compile();

    controller = module.get<FarmsController>(FarmsController);
    service = module.get<FarmsService>(FarmsService);
  });

  describe('create', () => {
    it('should create a new farm', async () => {
      const createFarmDto: CreateFarmDto = {
        name: 'Farm 1',
        city: 'City A',
        state: 'State A',
        totalArea: 1000,
        agriculturalArea: 800,
        producerId: '56e79a73-ceff-4472-acbe-47a2a6c96414',
      };

      const mockFarm = {
        id: '123',
        ...createFarmDto,
        producer: { id: createFarmDto.producerId },
      };

      mockFarmsService.createFarm.mockResolvedValue(mockFarm);

      const result = await controller.create(createFarmDto);

      expect(result).toEqual(mockFarm);
      expect(mockFarmsService.createFarm).toHaveBeenCalledWith(createFarmDto);
    });

    it('should throw ConflictException if farm already exists', async () => {
      const createFarmDto: CreateFarmDto = {
        name: 'Farm 1',
        city: 'City A',
        state: 'State A',
        totalArea: 1000,
        agriculturalArea: 800,
        producerId: '56e79a73-ceff-4472-acbe-47a2a6c96414',
      };

      mockFarmsService.createFarm.mockRejectedValue(new ConflictException('Fazenda já cadastrada'));

      await expect(controller.create(createFarmDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all farms', async () => {
      const farms = [
        { id: '1', name: 'Farm 1', city: 'City A', state: 'State A', totalArea: 1000, agriculturalArea: 800, producer: { id: '56e79a73-ceff-4472-acbe-47a2a6c96414' } },
        { id: '2', name: 'Farm 2', city: 'City B', state: 'State B', totalArea: 2000, agriculturalArea: 1500, producer: { id: '56e79a73-ceff-4472-acbe-47a2a6c96415' } },
      ];

      mockFarmsService.findAll.mockResolvedValue(farms);

      const result = await controller.findAll();

      expect(result).toEqual(farms);
      expect(mockFarmsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a farm by id', async () => {
      const farm = { id: '1', name: 'Farm 1', city: 'City A', state: 'State A', totalArea: 1000, agriculturalArea: 800, producer: { id: '56e79a73-ceff-4472-acbe-47a2a6c96414' } };

      mockFarmsService.findOne.mockResolvedValue(farm);

      const result = await controller.findOne('1');

      expect(result).toEqual(farm);
      expect(mockFarmsService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if farm is not found', async () => {
      mockFarmsService.findOne.mockRejectedValue(new NotFoundException('Fazenda não encontrada'));

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a farm', async () => {
      const updateFarmDto: UpdateFarmDto = {
        name: 'Farm Updated',
        city: 'City B',
        state: 'State B',
        totalArea: 1200,
        agriculturalArea: 600,
        producerId: '56e79a73-ceff-4472-acbe-47a2a6c96414',
      };

      const updatedFarm = { id: '1', ...updateFarmDto };

      mockFarmsService.updateFarm.mockResolvedValue(updatedFarm);

      const result = await controller.update('1', updateFarmDto);

      expect(result).toEqual(updatedFarm);
      expect(mockFarmsService.updateFarm).toHaveBeenCalledWith('1', updateFarmDto);
    });

    it('should throw NotFoundException if farm is not found for update', async () => {
      const updateFarmDto: UpdateFarmDto = {
        name: 'Farm Updated',
        city: 'City B',
        state: 'State B',
        totalArea: 1200,
        agriculturalArea: 600,
        producerId: '56e79a73-ceff-4472-acbe-47a2a6c96414',
      };

      mockFarmsService.updateFarm.mockRejectedValue(new NotFoundException('Fazenda não encontrada'));

      await expect(controller.update('1', updateFarmDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a farm', async () => {
      mockFarmsService.remove.mockResolvedValue(undefined);

      await expect(controller.remove('1')).resolves.not.toThrow();
      expect(mockFarmsService.remove).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if farm is not found for removal', async () => {
      mockFarmsService.remove.mockRejectedValue(new NotFoundException('Fazenda não encontrada'));

      await expect(controller.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
