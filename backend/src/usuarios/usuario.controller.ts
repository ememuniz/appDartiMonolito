import { Controller, Body, Post } from '@nestjs/common';
import { CriarUsuarioDto } from './dtos/criar-usuario.dto';
import { UsuarioService } from './usuario.service';

//_ITEM: ROTAS -> /usuario
@Controller('usuario')
export class UsuarioController {
  //__ITEM: CONSTRUTOR com o service como argumento
  constructor(private readonly usuarioService: UsuarioService) {}
  //__ITEM: ROTA -> POST: /usuario
  @Post()
  //__ITEM: FUNÇÃO REGISTRAR - RECEBE COMO PARAMETRO OS DADOS PASSADOS DO FRONTEND DEPOIS DE PASSAR PELO DTO
  //__ITEM: AVISA COM A PROMISE QUE VAI RETORNAR UM OBJETO COM NOME E MENSAGEM
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
}
