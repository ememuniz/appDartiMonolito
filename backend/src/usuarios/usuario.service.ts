import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
// Trás o DTO usado em  controller aqui tbm
import { CriarUsuarioDto } from './dtos/criar-usuario.dto';
import { LoginDto } from './dtos/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt'; //biblioteca para criptografia
import { JwtService } from '@nestjs/jwt';

//_ITEM: SERVICE DE USUARIO //
@Injectable()
export class UsuarioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
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
    //_____ITEM: PEGA O PAPEL DO CONVITE
    //_____ITEM: VERIFICA SE O EMAIL JA FOI USADO
    //_____ITEM: CADASTRA O USUARIO NO BANCO DE DADOS
    //_____ITEM: RETORNA UM NOME E UMA MENSAGEM
    //_____ITEM: FAZ O USADO DO CONVITE MUDAR PARA TRUE
    //_____ITEM: VARIAVEIS QUE VAO GUARDAR O RETORNO
    const resposta = { mensagem: '', nome: '', papel: '' };
    //___ITEM: VERIFICA SE A SENHA TEM 8 CARACTERES COM LETRA E NUMERO
    const regexValidaPassword = /^(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$/;
    if (!regexValidaPassword.test(dados.senha)) {
      throw new BadRequestException(
        'A senha precisa ter pelo menos 8 caracteres, uma letra e um número',
      );
    }
    //___ITEM: FAZ A CRIPTOGRAFIA DA SENHA
    const senhaCriptografada = await bcrypt.hash(dados.senha, 10);
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
    //___ITEM: PEGA O PAPEL DO CONVITE
    const convitePapel = conviteBd.papel;
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
        senha: senhaCriptografada,
        papel: convitePapel,
      },
    });
    resposta.mensagem = 'Cadastro realizado com sucesso';
    resposta.nome = usuario.nome;
    resposta.papel = usuario.papel;
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

  //__ITEM: LOGAR USUARIO
  //__ITEM: NO CONTROLLER, PEGAMOS OS DADOS NO @BODY
  //__ITEM: DEPOIS VALIDAMOS NO DTO
  //__ITEM: CHAMAMOS A FUNÇÃO LOGIN DO SERVICE E PASSAMOS O @BODY COMO PARAMETRO
  //__ITEM: EXECUTAMOS A FUNÇÃO LOGIN NO SERVICE
  //__ITEM: RETORNAMOS O RESULTADO NO SERVICE - NOME, MENSAGEM, PAPEL E TOKEN
  //__ITEM: RETORNAMOS O RESULTADO NO CONTROLLER - NOME, MENSAGEM, PAPEL E TOKEN
  //__ITEM: O RETORNO DO CONTROLLER É PASSADO PARA O CLIENTE NO FRONT
  async login(dados: LoginDto): Promise<{
    nome: string;
    mensagem: string;
    papel: string;
    acess_token: string | null;
  }> {
    //____ITEM: O QUE ESSA FUNÇÃO TEM QUE FAZER
    //_____ITEM: BUSCA O USUÁRIO PELO EMAIL
    //_____ITEM: AVISA SE O USUARIO NÃO EXISTE
    //_____ITEM: COMPARA A SENHA DIGITADA COM O HASH DO BANCO DE DADOS
    //_____ITEM: PREPARA AS INFORMAÇÕES LIGADAS AO TOKEN
    //___ITEM: RETORNA O NOME, MENSAGEM, PAPEL E TOKEN
    //____ITEM: FIM DOS REQUISITOS

    //___ITEM: BUSCA O USUARIO PELO EMAIL
    const usuario = await this.prisma.usuario.findUnique({
      where: {
        email: dados.email,
      },
    });
    //___ITEM: AVISA SE O USUARIO NAO EXISTE
    if (!usuario) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }
    //___ITEM: COMPARA A SENHA DIGITADA COM O HASH DO BANCO DE DADOS
    const senhaCorreta = await bcrypt.compare(dados.senha, usuario.senha);
    if (!senhaCorreta) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }
    //___ITEM: PREPARA AS INFORMAÇÕES LIGADAS AO TOKEN
    const payload = {
      sub: usuario.id,
      email: usuario.email,
      papel: usuario.papel,
    };
    return {
      nome: usuario.nome,
      mensagem: 'Login realizado com sucesso',
      papel: usuario.papel,
      acess_token: this.jwtService.sign(payload),
    };
  }
}
