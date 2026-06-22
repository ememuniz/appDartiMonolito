import { Controller, Body, Post, Get, Req, UseGuards } from '@nestjs/common';
import { CriarUsuarioDto } from './dtos/criar-usuario.dto';
import { LoginDto } from './dtos/login.dto';
import { UsuarioService } from './usuario.service';
import { AuthGuard } from './guards/auth.guard';

type RequestAutenticado = {
  user: {
    id: string;
    nome: string;
    email: string;
    papel: string;
  };
};

//_ITEM: ROTAS -> /usuario
@Controller('usuario')
export class UsuarioController {
  //__ITEM: CONSTRUTOR com o service como argumento
  constructor(private readonly usuarioService: UsuarioService) {}
  //__ITEM: ROTA -> GET: /usuario/perfil
  //__ITEM: FUNÇÃO OBTER PERFIL - RECEBE UMA REQUISIÇÃO DO TIPO GET COM O TOKEN E RETORNA UM OBJETO COM TODOS OS DADOS DO USUÁRIO LOGADO
  @Get('perfil')
  @UseGuards(AuthGuard)
  obterPerfil(@Req() req: RequestAutenticado) {
    const usuarioId = req.user.id;
    return this.usuarioService.buscarPorId(usuarioId);
  }
  //__ITEM: ROTA -> POST: /usuario
  //__ITEM: FUNÇÃO REGISTRAR - RECEBE COMO PARAMETRO OS DADOS PASSADOS DO FRONTEND DEPOIS DE PASSAR PELO DTO DE REGISTRO
  //__ITEM: AVISA COM A PROMISE QUE VAI RETORNAR UM OBJETO COM NOME E MENSAGEM
  @Post()
  async registrar(
    @Body() dados: CriarUsuarioDto,
  ): Promise<{ nome: string; mensagem: string; papel: string }> {
    const resultado = await this.usuarioService.criarUsuario({
      nome: dados.nome,
      email: dados.email,
      senha: dados.senha,
      convite: dados.convite,
    });
    return resultado;
  }

  //__ITEM: ROTA -> POST: /usuario/login
  //__ITEM: FUNÇÃO LOGAR - RECEBE COMO PARAMETRO OS DADOS PASSADOS DO FRONTEND DEPOIS DE PASSAR PELO DTO DE LOGIN
  @Post('login')
  async logar(@Body() dados: LoginDto): Promise<{
    nome: string;
    mensagem: string;
    papel: string;
    acess_token: string | null;
  }> {
    const resultado = await this.usuarioService.login({
      email: dados.email,
      senha: dados.senha,
    });
    return resultado;
  }
}
