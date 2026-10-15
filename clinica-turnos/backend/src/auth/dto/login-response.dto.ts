import { ApiProperty } from '@nestjs/swagger';
import { RolUsuario } from '../enums/rol.enum.js';
import { EstadoUsuario } from '../enums/estado-usuario.enum.js';

export class UsuarioResponseDto {
  @ApiProperty({ example: 1, description: 'ID identificador unico del usuario' })
  id: number;

  @ApiProperty({ example: '11111111', description: 'Documento del usuario' })
  documento: string;

  @ApiProperty({ example: 'Gonzalez', description: 'Apellidos del usuario' })
  apellidos: string;

  @ApiProperty({ example: 'Carlos', description: 'Nombres del usuario' })
  nombres: string;

  @ApiProperty({ example: 'carlos.gonzalez@clinica.com', description: 'Correo electronico' })
  email: string;

  @ApiProperty({ enum: EstadoUsuario, example: EstadoUsuario.ACTIVO })
  estado: EstadoUsuario;

  @ApiProperty({ enum: RolUsuario, example: RolUsuario.ADMINISTRADOR })
  rol: RolUsuario;
}

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token JWT para autorizacion Bearer',
  })
  accessToken: string;

  @ApiProperty({ type: UsuarioResponseDto, description: 'Datos del usuario autenticado' })
  usuario: UsuarioResponseDto;
}
