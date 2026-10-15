import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator.js';
import { RolUsuario } from '../enums/rol.enum.js';
import { JwtPayload } from '../interfaces/jwt-payload.interface.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RolUsuario[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si la ruta no especifica roles requeridos, se permite el acceso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user }: { user: JwtPayload } = context.switchToHttp().getRequest();

    if (!user || !user.rol) {
      throw new ForbiddenException(
        'Acceso denegado: No se encontro el rol del usuario autenticado',
      );
    }

    const hasRole = requiredRoles.includes(user.rol);
    if (!hasRole) {
      throw new ForbiddenException(
        `Acceso denegado: El rol '${user.rol}' no tiene permisos para esta operacion. Se requiere: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
