import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ProducersService } from './producers.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { PaginationDto } from '../core/dto/pagination.dto';
  
  @Controller('producers')
  export class ProducersController {
    constructor(private readonly producersService: ProducersService) {}
  
    @Post()
    async create(@Body() createProducerDto: CreateProducerDto) {
      return this.producersService.create(createProducerDto);
    }
  
    @Get()
    async findAll(@Query() paginationDto: PaginationDto) {
      return this.producersService.findAll(paginationDto);
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string) {
      return this.producersService.findOne(id);
    }
  
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() updateProducerDto: UpdateProducerDto,
    ) {
      return this.producersService.update(id, updateProducerDto);
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string) {
      return this.producersService.remove(id);
    }
  }
  