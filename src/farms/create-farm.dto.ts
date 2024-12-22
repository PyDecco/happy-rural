import { IsNumber, ValidateIf } from 'class-validator';

export class CreateFarmDto {
  @IsNumber()
  totalArea: number;

  @IsNumber()
  agriculturalArea: number;

  @IsNumber()
  vegetationArea: number;

  @ValidateIf((obj) => obj.agriculturalArea + obj.vegetationArea > obj.totalArea)
  areaValidation() {
    throw new Error('Agricultural and vegetation areas exceed total area');
  }
}
