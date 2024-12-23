import { Test, TestingModule } from '@nestjs/testing';
import { FarmsService } from './farms.service';
import { ProducersService } from '../producers/producers.service';
import { NotFoundException } from '@nestjs/common';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';

describe('FarmsService', () => {
  let service: FarmsService;

  const mockProducersService = {
    findOne: jest.fn(),
  };

  const mockFarmRepository = {
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    find: jest.fn(),
  };

  const mockCropRepository = {
    save: jest.fn(),
    findByIds: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmsService,
        { provide: ProducersService, useValue: mockProducersService },
        { provide: 'FarmRepository', useValue: mockFarmRepository },
        { provide: 'CropRepository', useValue: mockCropRepository },
      ],
    }).compile();

    service = module.get<FarmsService>(FarmsService);
  });

  describe('updateFarm', () => {
    it('should throw NotFoundException if producer is not found', async () => {
        const updateFarmDto: UpdateFarmDto = {
          name: 'Farm Updated',
          city: 'City B',
          state: 'State B',
          totalArea: 1000,
          agriculturalArea: 800,
          producerId: '56e79a73-ceff-4472-acbe-47a2a6c96414', 
          crops: ['cropId1', 'cropId2'],
        };
      
        mockProducersService.findOne.mockRejectedValueOnce(
            new NotFoundException('Produtor não encontrado'),
          );       
      
        await expect(service.updateFarm('someFarmId', updateFarmDto)).rejects.toThrow(NotFoundException);
      
        expect(mockProducersService.findOne).toHaveBeenCalledWith(updateFarmDto.producerId);
      });
      

      it('should update a farm', async () => {
        const farm = {
          id: 'c7816feb-2a38-42df-972f-d6ec44c799f4',
          name: 'Farm 1',
          city: 'City A',
          state: 'State A',
          totalArea: 1000,
          agriculturalArea: 800,
          producer: { id: '56e79a73-ceff-4472-acbe-47a2a6c96414' },
          crops: [],
        };
      
        const updateFarmDto = {
          name: 'Farm Updated',
          city: 'City B',
          state: 'State B',
          totalArea: 1000,
          agriculturalArea: 800,
          producerId: '56e79a73-ceff-4472-acbe-47a2a6c96414',
          crops: ['cropId1', 'cropId2'],
        };

        const mockProducer = { id: '56e79a73-ceff-4472-acbe-47a2a6c96414' };
        
        const mockCrops = [
          { id: 'cropId1', name: 'Crop 1' },
          { id: 'cropId2', name: 'Crop 2' },
        ];
      
        const updatedFarm = {
          id: farm.id,
          ...updateFarmDto,
          crops: mockCrops,
          producer: { id: '56e79a73-ceff-4472-acbe-47a2a6c96414' },
        };

        mockProducersService.findOne.mockResolvedValue(mockProducer); 
        mockCropRepository.findByIds.mockResolvedValue(mockCrops);
        mockFarmRepository.preload.mockResolvedValue({
          id: farm.id,
          ...updateFarmDto,
          crops: mockCrops,
          producer: { id: '56e79a73-ceff-4472-acbe-47a2a6c96414' },
        });
        mockFarmRepository.save.mockResolvedValue(updatedFarm);
      
        const result = await service.updateFarm(farm.id, updateFarmDto);
      
        expect(result).toEqual(updatedFarm);
        expect(mockFarmRepository.preload).toHaveBeenCalledWith({
          id: farm.id,
          ...updateFarmDto,
          crops: mockCrops,
          producer: { id: '56e79a73-ceff-4472-acbe-47a2a6c96414' },
        });
        expect(mockFarmRepository.save).toHaveBeenCalledWith(updatedFarm);
        expect(mockCropRepository.findByIds).toHaveBeenCalledWith(updateFarmDto.crops);
      });
  });

  describe('createFarm', () => {
    it('should create and save a farm', async () => {
      const createFarmDto: CreateFarmDto = {
        name: 'Farm A',
        city: 'City A',
        state: 'State A',
        totalArea: 500,
        agriculturalArea: 300,
        producerId: '12345',
      };

      const producer = { id: '12345', name: 'Producer A' };
      const farm = { id: '1', ...createFarmDto, producer, crops: [] };

      mockProducersService.findOne.mockResolvedValue(producer);
      mockFarmRepository.create.mockReturnValue(farm);
      mockFarmRepository.save.mockResolvedValue(farm);

      const result = await service.createFarm(createFarmDto);

      expect(result).toEqual(farm);
      expect(mockProducersService.findOne).toHaveBeenCalledWith(createFarmDto.producerId);
      expect(mockFarmRepository.create).toHaveBeenCalledWith({ ...createFarmDto, crops: [], producer });
      expect(mockFarmRepository.save).toHaveBeenCalledWith(farm);
    });
  });

  describe('findAll', () => {
    it('should return all farms', async () => {
      const farms = [
        { id: '1', name: 'Farm A', crops: [], producer: { id: '12345' } },
        { id: '2', name: 'Farm B', crops: [], producer: { id: '67890' } },
      ];

      mockFarmRepository.find.mockResolvedValue(farms);

      const result = await service.findAll();

      expect(result).toEqual(farms);
      expect(mockFarmRepository.find).toHaveBeenCalledWith({ relations: ['crops', 'producer'] });
    });
  });

  describe('findOne', () => {
    it('should find a farm by ID', async () => {
      const farm = { id: '1', name: 'Farm A', crops: [], producer: { id: '12345' } };

      mockFarmRepository.findOne.mockResolvedValue(farm);

      const result = await service.findOne('1');

      expect(result).toEqual(farm);
      expect(mockFarmRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' }, relations: ['crops', 'producer'] });
    });

    it('should throw NotFoundException if farm is not found', async () => {
      mockFarmRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrowError(new NotFoundException('Fazenda não encontrada'));
      expect(mockFarmRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' }, relations: ['crops', 'producer'] });
    });
  });

  describe('remove', () => {
    it('should remove a farm by ID', async () => {
      const farm = { id: '1', name: 'Farm A', crops: [], producer: { id: '12345' } };

      mockFarmRepository.findOne.mockResolvedValue(farm);
      mockFarmRepository.remove.mockResolvedValue(undefined);

      await service.remove('1');

      expect(mockFarmRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' }, relations: ['crops', 'producer'] });
      expect(mockFarmRepository.remove).toHaveBeenCalledWith(farm);
    });

    it('should throw NotFoundException if farm to remove is not found', async () => {
      mockFarmRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrowError(new NotFoundException('Fazenda não encontrada'));
      expect(mockFarmRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' }, relations: ['crops', 'producer'] });
    });
  });
});
