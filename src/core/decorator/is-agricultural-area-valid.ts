import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsAgriculturalAreaValid(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
      registerDecorator({
        name: 'IsAgriculturalAreaValid',
        target: object.constructor,
        propertyName: propertyName,
        constraints: [],
        options: validationOptions,
        validator: {
          validate(value: any, args: ValidationArguments) {
            const object = args.object as any;
            console.log('Validando', value, object.totalArea); 
            return value <= object.totalArea;  
          },
          defaultMessage(args: ValidationArguments) {
            return `A área agrícola não pode ser maior que a área total da fazenda`;
          },
        },
      });
    };
  }
  
