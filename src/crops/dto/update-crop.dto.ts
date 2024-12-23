import { IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';

export class UpdateCropDto {
  @IsOptional()
  @IsString()
  cropName?: string;

  @IsOptional()
  @IsNumber()
  vegetationArea?: number;

  @IsOptional()
  @IsDateString()
  plantingDate?: string;

  @IsOptional()
  @IsDateString()
  harvestDate?: string;
}
