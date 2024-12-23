import { IsString, IsNumber, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';
import { IsAgriculturalAreaValid } from '../../core/decorator/is-agricultural-area-valid';

export class CreateFarmDto {
  @IsString()
  name: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsNumber()
  totalArea: number;

  @IsNumber()
  @IsAgriculturalAreaValid({
    message: 'A área agrícola não pode ser maior que a área total da fazenda',
  })
  agriculturalArea: number;

  @IsUUID()
  producerId: string; 
}

