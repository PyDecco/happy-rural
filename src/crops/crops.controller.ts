import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CropsService } from './crops.service';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';

@Controller('crops')
export class CropsController {
  constructor(private readonly cropsService: CropsService) {}

  @Post()
  async create(@Body() createCropDto: CreateCropDto) {
    return this.cropsService.create(createCropDto);
  }

  @Get()
  async findAll() {
    return this.cropsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.cropsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCropDto: UpdateCropDto) {
    return this.cropsService.update(id, updateCropDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.cropsService.remove(id);
  }
}
