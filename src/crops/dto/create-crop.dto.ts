import { IsNotEmpty, IsString, IsUUID, IsDateString, IsOptional, IsNumber } from 'class-validator';

export class CreateCropDto {
  @IsNotEmpty()
  @IsString()
  cropName: string;

  @IsNotEmpty()
  @IsUUID()
  farmId: string;

  @IsNotEmpty()
  @IsNumber()
  vegetationArea: number; 

  @IsDateString()
  plantingDate: string; 

  @IsOptional()
  @IsDateString()
  harvestDate?: string; 
}
