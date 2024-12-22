import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { cpf, cnpj } from 'cpf-cnpj-validator';  // Biblioteca para validação de CPF e CNPJ

export function IsCpfOrCnpj(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsCpfOrCnpj',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return true; // Se o valor for vazio ou não informado, não valida
          return cpf.isValid(value) || cnpj.isValid(value); // Verifica se é um CPF ou CNPJ válido
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} deve ser um CPF ou CNPJ válido`; // Mensagem padrão de erro
        },
      },
    });
  };
}
