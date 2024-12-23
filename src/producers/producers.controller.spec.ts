import { Test, TestingModule } from '@nestjs/testing';
import { ProducersController } from './producers.controller';
import { ProducersService } from './producers.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { ConflictException } from '@nestjs/common';

describe('ProducersController', () => {
  let controller: ProducersController;
  let service: ProducersService;

  const mockProducersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProducersController],
      providers: [
        { provide: ProducersService, useValue: mockProducersService },
      ],
    }).compile();

    controller = module.get<ProducersController>(ProducersController);
    service = module.get<ProducersService>(ProducersService);
  });

  describe('create', () => {
    it('should create a new producer', async () => {
      const createProducerDto: CreateProducerDto = {
        cpfOrCnpj: '12345678901234',
        name: 'Test Producer',
      };

      mockProducersService.create.mockResolvedValue({
        id: '123',
        ...createProducerDto,
      });

      const result = await controller.create(createProducerDto);

      expect(result).toEqual({ id: '123', ...createProducerDto });
      expect(mockProducersService.create).toHaveBeenCalledWith(createProducerDto);
    });

    it('should throw ConflictException if producer already exists', async () => {
      const createProducerDto: CreateProducerDto = {
        cpfOrCnpj: '12345678901234',
        name: 'Test Producer',
      };

      mockProducersService.create.mockRejectedValue(new ConflictException('Produtor já cadastrado'));

      await expect(controller.create(createProducerDto)).rejects.toThrow(ConflictException);
    });
  });
});
