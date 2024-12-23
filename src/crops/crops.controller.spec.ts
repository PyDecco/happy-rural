import { Test, TestingModule } from '@nestjs/testing';
import { CropsController } from './crops.controller';
import { CropsService } from './crops.service';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';

describe('CropsController', () => {
  let controller: CropsController;
  let service: CropsService;

  const mockCrop = {
    id: '1',
    cropName: 'Corn',
    vegetationArea: 10,
    plantingDate: '2023-01-01',
    harvestDate: '2023-12-01',
    farm: { id: 'farm1' },
  };

  const mockCropsService = {
    create: jest.fn().mockResolvedValue(mockCrop),
    findAll: jest.fn().mockResolvedValue([mockCrop]),
    findOne: jest.fn().mockResolvedValue(mockCrop),
    update: jest.fn().mockResolvedValue(mockCrop),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CropsController],
      providers: [
        {
          provide: CropsService,
          useValue: mockCropsService,
        },
      ],
    }).compile();

    controller = module.get<CropsController>(CropsController);
    service = module.get<CropsService>(CropsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a crop', async () => {
      const dto: CreateCropDto = {
        cropName: 'Corn',
        farmId: 'farm1',
        vegetationArea: 10,
        plantingDate: '2023-01-01',
        harvestDate: '2023-12-01',
      };

      const result = await controller.create(dto);
      expect(result).toEqual(mockCrop);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all crops', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockCrop]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single crop', async () => {
      const result = await controller.findOne('1');
      expect(result).toEqual(mockCrop);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a crop', async () => {
      const dto: UpdateCropDto = { cropName: 'Updated Corn', farmId: 'farm1' };
      const result = await controller.update('1', dto);
      expect(result).toEqual(mockCrop);
      expect(service.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should remove a crop', async () => {
      const result = await controller.remove('1');
      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
