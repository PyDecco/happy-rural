import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateProducerDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{11}$|^\d{14}$/, {
    message: 'CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos',
  })
  cpfOrCnpj: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
