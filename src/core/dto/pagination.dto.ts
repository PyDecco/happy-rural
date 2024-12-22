import { IsOptional, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 1)) // Converte para número ou usa o valor padrão 1
  @IsInt({ message: 'Page deve ser um número inteiro' })
  @Min(1, { message: 'Page deve ser no mínimo 1' })
  page: number = 1; // Define o valor padrão

  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 10)) // Converte para número ou usa o valor padrão 10
  @IsInt({ message: 'Limit deve ser um número inteiro' })
  @Min(1, { message: 'Limit deve ser no mínimo 1' })
  limit: number = 10; // Define o valor padrão
}
