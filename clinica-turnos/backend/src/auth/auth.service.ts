import {
  Injectable,
  UnauthorizedException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto.js';
import { LoginResponseDto } from './dto/login-response.dto.js';
import { UsuarioMock } from './interfaces/usuario-mock.interface.js';
import { RolUsuario } from './enums/rol.enum.js';
import { EstadoUsuario } from './enums/estado-usuario.enum.js';
import { JwtPayload } from './interfaces/jwt-payload.interface.js';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  /**
   * Usuarios de prueba en memoria para desacoplar el desarrollo
   * de la base de datos hasta que Roberto (P1) configure TypeORM y PostgreSQL.
   */
  private usuariosMock: UsuarioMock[] = [
    {
      id: 1,
      documento: '11111111',
      apellidos: 'Admin',
      nombres: 'Sistema',
      email: 'admin@clinica.com',
      clave: 'admin123', // Se hashea en onModuleInit
      estado: EstadoUsuario.ACTIVO,
      rol: RolUsuario.ADMINISTRADOR,
    },
    {
      id: 2,
      documento: '22222222',
      apellidos: 'Favaloro',
      nombres: 'Rene',
      email: 'rene.favaloro@clinica.com',
      clave: 'medico123', // Se hashea en onModuleInit
      estado: EstadoUsuario.ACTIVO,
      rol: RolUsuario.MEDICO,
    },
    {
      id: 3,
      documento: '33333333',
      apellidos: 'Perez',
      nombres: 'Juan',
      email: 'juan.perez@paciente.com',
      clave: 'paciente123', // Se hashea en onModuleInit
      estado: EstadoUsuario.ACTIVO,
      rol: RolUsuario.PACIENTE,
    },
    {
      id: 4,
      documento: '44444444',
      apellidos: 'Inactivo',
      nombres: 'Carlos',
      email: 'carlos.inactivo@clinica.com',
      clave: 'baja123', // Se hashea en onModuleInit
      estado: EstadoUsuario.BAJA,
      rol: RolUsuario.PACIENTE,
    },
  ];

  constructor(private readonly jwtService: JwtService) {}

  async onModuleInit() {
    // Hasheamos las contraseñas con bcrypt al inicializar para simular la DB real
    const saltRounds = 10;
    for (const usuario of this.usuariosMock) {
      if (!usuario.clave.startsWith('$2b$')) {
        usuario.clave = await bcrypt.hash(usuario.clave, saltRounds);
      }
    }
    this.logger.log('AuthService inicializado con usuarios mock hasheados con bcrypt.');
  }

  /**
   * Autentica a un usuario y genera su token JWT de sesion.
   */
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { documento, clave } = loginDto;

    // 1. Busqueda del usuario por documento
    // NOTA: Cuando Roberto configure TypeORM, aqui se reemplaza por:
    // const usuario = await this.usuarioRepository.findOne({ where: { documento } });
    const usuario = this.usuariosMock.find((u) => u.documento === documento);

    if (!usuario) {
      throw new UnauthorizedException('Credenciales invalidas (documento o clave incorrectos)');
    }

    // 2. Validacion de estado segun consigna: Solo usuarios en estado ACTIVO pueden iniciar sesion
    if (usuario.estado !== EstadoUsuario.ACTIVO) {
      throw new UnauthorizedException(
        'El usuario no se encuentra activo en el sistema. Estado actual: ' + usuario.estado,
      );
    }

    // 3. Comparacion segura de contraseña mediante bcrypt
    const claveValida = await bcrypt.compare(clave, usuario.clave);
    if (!claveValida) {
      throw new UnauthorizedException('Credenciales invalidas (documento o clave incorrectos)');
    }

    // 4. Generacion de payload para el JWT
    const payload: JwtPayload = {
      sub: usuario.id,
      documento: usuario.documento,
      email: usuario.email,
      rol: usuario.rol,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      usuario: {
        id: usuario.id,
        documento: usuario.documento,
        apellidos: usuario.apellidos,
        nombres: usuario.nombres,
        email: usuario.email,
        estado: usuario.estado,
        rol: usuario.rol,
      },
    };
  }

  /**
   * Metodo helper para obtener todos los usuarios mock (util para pruebas y documentacion)
   */
  obtenerUsuariosMock() {
    return this.usuariosMock.map(({ clave: _, ...resto }) => resto);
  }
}
