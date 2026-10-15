import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: '11111111',
    description: 'Numero de documento unico del usuario',
  })
  @IsNotEmpty({ message: 'El documento es obligatorio' })
  @IsString({ message: 'El documento debe ser una cadena de texto' })
  documento: string;

  @ApiProperty({
    example: 'admin123',
    description: 'Clave de acceso al sistema (minimo 4 caracteres)',
  })
  @IsNotEmpty({ message: 'La clave es obligatoria' })
  @IsString({ message: 'La clave debe ser una cadena de texto' })
  @MinLength(4, { message: 'La clave debe contener al menos 4 caracteres' })
  clave: string;
}
