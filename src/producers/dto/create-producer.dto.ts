import { IsNotEmpty, IsString } from 'class-validator';
import { IsCpfOrCnpj } from '../../core/decorator/cpf-cnpj.decorator'; 

export class CreateProducerDto {
  @IsNotEmpty()
  @IsString()
  @IsCpfOrCnpj({
    message: 'CPF ou CNPJ inválido',
  })
  cpfOrCnpj: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
