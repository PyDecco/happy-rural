import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { IsAgriculturalAreaValid } from '../../core/decorator/is-agricultural-area-valid';

export class UpdateFarmDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  city?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  state?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  totalArea?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @IsAgriculturalAreaValid({
    message: 'A área agrícola não pode ser maior que a área total da fazenda',
  })
  agriculturalArea?: number;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true }) 
  crops?: string[]; 

  @IsUUID()
  producerId: string; 
}
