import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

describe('DashboardController', () => {
  let controller: DashboardController;
  let service: DashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: DashboardService,
          useValue: {
            getOverview: jest.fn(),
            getFarmsByState: jest.fn(),
            getCropsByType: jest.fn(),
            getLandUsage: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    service = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOverview', () => {
    it('should call DashboardService.getOverview and return its result', async () => {
      const mockResult = { totalFarms: 3, totalArea: 1500 };
      jest.spyOn(service, 'getOverview').mockResolvedValue(mockResult);

      const result = await controller.getOverview('producer-id');
      expect(result).toEqual(mockResult);
      expect(service.getOverview).toHaveBeenCalledWith('producer-id');
    });
  });

  describe('getFarmsByState', () => {
    it('should call DashboardService.getFarmsByState and return its result', async () => {
      const mockResult = [
        { state: 'SP', total: 2 },
        { state: 'MG', total: 1 },
      ];
      jest.spyOn(service, 'getFarmsByState').mockResolvedValue(mockResult);

      const result = await controller.getFarmsByState('producer-id');
      expect(result).toEqual(mockResult);
      expect(service.getFarmsByState).toHaveBeenCalledWith('producer-id');
    });
  });

  describe('getCropsByType', () => {
    it('should call DashboardService.getCropsByType and return its result', async () => {
      const mockResult = [
        { cropName: 'Soybean', total: 4 },
        { cropName: 'Corn', total: 2 },
      ];
      jest.spyOn(service, 'getCropsByType').mockResolvedValue(mockResult);

      const result = await controller.getCropsByType('producer-id');
      expect(result).toEqual(mockResult);
      expect(service.getCropsByType).toHaveBeenCalledWith('producer-id');
    });
  });

  describe('getLandUsage', () => {
    it('should call DashboardService.getLandUsage and return its result', async () => {
      const mockResult = {
        totalAgriculturalArea: 1000,
        totalVegetationArea: 500,
      };
      jest.spyOn(service, 'getLandUsage').mockResolvedValue(mockResult);

      const result = await controller.getLandUsage('producer-id');
      expect(result).toEqual(mockResult);
      expect(service.getLandUsage).toHaveBeenCalledWith('producer-id');
    });
  });
});
