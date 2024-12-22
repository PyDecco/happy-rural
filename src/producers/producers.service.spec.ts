import { Test, TestingModule } from '@nestjs/testing';
import { ProducersService } from './producers.service';
import { ProducersRepository } from './producers.repository';
import { CreateProducerDto } from './dto/create-producer.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PaginationDto } from 'src/core/dto/pagination.dto';

describe('ProducersService', () => {
  let service: ProducersService;
  let repository: ProducersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducersService,
        {
          provide: ProducersRepository,
          useValue: {
            findOne: jest.fn(),
            created: jest.fn(),
            findAll: jest.fn(),
            findOneById: jest.fn(),
            removed: jest.fn(),
            updated: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProducersService>(ProducersService);
    repository = module.get<ProducersRepository>(ProducersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should throw ConflictException if producer already exists', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce({ id: '1', cpfOrCnpj: '123456789' } as any);
      const dto: CreateProducerDto = { cpfOrCnpj: '123456789', name: 'Test Producer' };

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('should create a new producer if it does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(repository, 'created').mockResolvedValueOnce({ id: '1', cpfOrCnpj: '123456789' } as any);
      const dto: CreateProducerDto = { cpfOrCnpj: '123456789', name: 'Test Producer' };

      const result = await service.create(dto);
      expect(result).toEqual({ id: '1', cpfOrCnpj: '123456789' });
      expect(repository.created).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return a list of producers', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValueOnce([{ id: '1', cpfOrCnpj: '123456789' }] as any);
      const paginationDto: PaginationDto = { page: 1, limit: 10 };

      const result = await service.findAll(paginationDto);
      expect(result).toEqual([{ id: '1', cpfOrCnpj: '123456789' }]);
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException if producer does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });

    it('should remove a producer if it exists', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce({ id: '1' } as any);
      jest.spyOn(repository, 'removed').mockResolvedValueOnce();

      await service.remove('1');
      expect(repository.removed).toHaveBeenCalledWith('1');
    });
  });
});
