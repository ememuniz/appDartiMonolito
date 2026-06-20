import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
// Trás o DTO usado em  controller aqui tbm
import { CriarUsuarioDto } from './dtos/criar-usuario.dto';
import { PrismaService } from '../prisma/prisma.service';

//_ITEM: SERVICE DE USUARIO //
@Injectable()
export class UsuarioService {
  constructor(private readonly prisma: PrismaService) {}
  //__ITEM: CRIA USUÁRIO
  //__ITEM: NO CONTROLLER, PEGAMOS OS DADOS NO @BODY
  //__ITEM: DEPOIS VALIDAMOS NO DTO
  //__ITEM: CHAMAMOS A FUNÇÃO CRIAR USUARIO DO SERVICE E PASSAMOS O @BODY COMO PARAMETRO
  //__ITEM: EXECUTAMOS A FUNÇÃO CRIARUSUARIO NO SERVICE
  //__ITEM: RETORNAMOS O RESULTADO NO SERVICE
  //__ITEM: RETORNAMOS O RESULTADO NO CONTROLLER
  //__ITEM: O RETORNO DO CONTROLLER E PASSADO PARA O CLIENTE NO FRONT
  async criarUsuario(dados: CriarUsuarioDto) {
    //___ITEM: O QUE ESSA FUNÇÃO TEM QUE FAZER
    //_____ITEM: VERIFICA SE A SENHA TEM 8 CARACTERES COM LETRA E NUMERO
    //_____ITEM: VERIFICA SE O CONVITE EXISTE
    //_____ITEM: VERIFICA SE O CONVITE JA FOI USADO
    //_____ITEM: VERIFICA SE O EMAIL JA FOI USADO
    //_____ITEM: CADASTRA O USUARIO NO BANCO DE DADOS
    //_____ITEM: RETORNA UM NOME E UMA MENSAGEM
    //_____ITEM: FAZ O USADO DO CONVITE MUDAR PARA TRUE
    //_____ITEM: VARIAVEIS QUE VAO GUARDAR O RETORNO
    const resposta = { mensagem: '', nome: '' };
    //___ITEM: VERIFICA SE A SENHA TEM 8 CARACTERES COM LETRA E NUMERO
    const regexValidaPassword = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!regexValidaPassword.test(dados.senha)) {
      throw new BadRequestException(
        'A senha precisa ter pelo menos 8 caracteres, uma letra e um número',
      );
    }
    //___ITEM: VERIFICA SE O CONVITE EXISTE
    const conviteBd = await this.prisma.convite.findUnique({
      where: {
        codigo: dados.convite,
      },
    });
    if (!conviteBd) {
      throw new UnauthorizedException('O seu convite não é válido');
    }
    //___ITEM: VERIFICA SE O CONVITE JA FOI USADO
    if (conviteBd.usado) {
      throw new UnauthorizedException('O convite já foi usado');
    }
    //___ITEM: VERIFICA SE O EMAIL JA FOI USADO
    const emailBd = await this.prisma.usuario.findUnique({
      where: {
        email: dados.email,
      },
    });
    if (emailBd) {
      throw new ConflictException('O email já foi usado');
    }
    //___ITEM: CADASTRA O USUARIO NO BANCO DE DADOS
    const usuario = await this.prisma.usuario.create({
      data: {
        email: dados.email,
        nome: dados.nome,
        senha: dados.senha,
      },
    });
    resposta.mensagem = 'Cadastro realizado com sucesso';
    resposta.nome = usuario.nome;
    //___ITEM: FAZ O USADO DO CONVITE MUDAR PARA TRUE
    await this.prisma.convite.update({
      where: {
        codigo: dados.convite,
      },
      data: {
        usado: true,
      },
    });
    await Promise.resolve();
    //___ITEM: RETORNA UM NOME E UMA MENSAGEM
    return resposta;
  }
}
