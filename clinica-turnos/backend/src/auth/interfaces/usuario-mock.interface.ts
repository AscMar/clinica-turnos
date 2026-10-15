import { RolUsuario } from '../enums/rol.enum.js';
import { EstadoUsuario } from '../enums/estado-usuario.enum.js';

export interface UsuarioMock {
  id: number;
  documento: string;
  apellidos: string;
  nombres: string;
  email: string;
  clave: string; // Hash bcrypt
  estado: EstadoUsuario;
  rol: RolUsuario;
}
