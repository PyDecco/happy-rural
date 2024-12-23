import { IsOptional, IsString, IsDateString, IsNumber, IsNotEmpty, IsUUID } from 'class-validator';

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

  @IsNotEmpty()
  @IsUUID()
  farmId: string;
}
