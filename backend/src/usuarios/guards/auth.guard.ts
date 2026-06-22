import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extrairTokenDoCabeçalho(request);

    if (!token) {
      throw new UnauthorizedException('Token não fornecido.');
    }

    try {
      interface JwtPayload {
        id: string;
        email: string;
        papel: string;
        nome: string;
      }
      // Valida o token usando a mesma chave secreta do módulo
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret:
          process.env.JWT_SECRET ||
          'uma_chave_super_secreta_e_segura_de_sua_escolha_123!',
      });

      // 💡 A MÁGICA AQUI: Injetamos o payload do token (id, email, papel) dentro da requisição
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }

    return true;
  }
  private extrairTokenDoCabeçalho(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
