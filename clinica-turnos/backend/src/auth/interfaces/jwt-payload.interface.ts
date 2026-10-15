import { RolUsuario } from '../enums/rol.enum.js';

export interface JwtPayload {
  sub: number;
  documento: string;
  email: string;
  rol: RolUsuario;
  nombres: string;
  apellidos: string;
}
