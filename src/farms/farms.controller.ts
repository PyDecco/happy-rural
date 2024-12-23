import { Controller, Post, Get, Put, Param, Body, Delete, Patch, ValidationPipe } from '@nestjs/common';
import { FarmsService } from './farms.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';

@Controller('farms')
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) {}

  @Post()
  async create(@Body(new ValidationPipe()) createFarmDto: CreateFarmDto) {
    return this.farmsService.createFarm(createFarmDto);
  }

  @Get()
  async findAll() {
    return this.farmsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.farmsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateFarmDto: UpdateFarmDto) {
    return this.farmsService.updateFarm(id, updateFarmDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.farmsService.remove(id);
  }
}

