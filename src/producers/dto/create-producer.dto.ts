import { IsNotEmpty, IsString } from 'class-validator';
import { IsCpfOrCnpj } from '../../core/decorator/cpf-cnpj.decorator'; // Importando o decorator personalizado

export class CreateProducerDto {
  @IsNotEmpty()
  @IsString()
  @IsCpfOrCnpj({
    message: 'CPF ou CNPJ inválido', // Mensagem de erro personalizada
  })
  cpfOrCnpj: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
