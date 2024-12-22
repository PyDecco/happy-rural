import { IsOptional, IsString, IsUUID, IsNotEmpty } from 'class-validator';
import { IsCpfOrCnpj } from '../../core/decorator/cpf-cnpj.decorator';

export class UpdateProducerDto {
  @IsOptional() 
  @IsString()
  @IsCpfOrCnpj({
    message: 'CPF ou CNPJ inválido', 
  })
  cpfOrCnpj?: string; 

  @IsOptional() 
  @IsString()
  @IsNotEmpty()
  name?: string; 

  @IsOptional() 
  @IsUUID()
  id?: string; 
}
