// Test usado para testar o usuário
// TestingModule usado para testar o módulo
// INestApplication usado para testar a aplicação Nest
// request usado para testar a requisição
// supertest é uma biblioteca para testar a requisição]
// AppModule está aqui porque é o módulo principal e vai incluir todo o backend
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Server } from 'http';
import { ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';

//_ITEM: TESTES DE USUÁRIOS //
describe('Testes de Usuários', () => {
  //__ITEM: DECLARAÇÃO DE VARIAVEL DE APP SIMULADO //
  // Aqui é criado uma variável app que será uma simulação de uma aplicação Nest
  let app: INestApplication;
  let prisma: PrismaService; //usado para resetar o banco de dados
  //__ITEM: CONFIGURAÇÃO DO SERVIDOR //
  beforeAll(async () => {
    //___ITEM: CRIA UM MÓDULO TEST
    // No módulo test, vamos incluir o módulo principal pra simular o backend
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    //___ITEM: CRIA A APLICACAO SIMULADA //
    app = module.createNestApplication({
      logger: ['error', 'warn', 'log'],
    });
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = app.get<PrismaService>(PrismaService); //rouba a instancia do prisma para resetar o banco de dados
  });

  //__ITEM: CRIA USUÁRIO COM SUCESSO //
  it('Deve criar um usuário no banco de dados com sucesso', async () => {
    //___ITEM: CRIA UM USUÁRIO FAKE PARA PASSAR COMO ENTRADA //
    const jsonEntrada = {
      email: '4iB0U@example.com',
      nome: 'Teste',
      convite: '123456',
      senha: 'Senha123456',
    };

    //___ITEM: FAZ A REQUISICAO POST PARA CRIAR O USUÁRIO E ENVIA O USUÁRIO FAKE COMO CORPO //
    const response = await request(app.getHttpServer() as Server)
      .post('/usuario')
      .send(jsonEntrada);

    //___ITEM: DEFINE O TIPO DA RESPOSTA //
    const respostaCriarUsuario = response.body as {
      mensagem: string;
      nome: string;
    };
    expect(response.status).toBe(201);
    expect(respostaCriarUsuario.mensagem).toBe(
      'Cadastro realizado com sucesso',
    );
    expect(respostaCriarUsuario.nome).toBe(jsonEntrada.nome);
  });

  //__ITEM: CRIA USUÁRIO COM SENHA ERRADA E RETORNA UM ERRO //
  it('Deve tentar criar um usuário com a senha errada e retornar um erro', async () => {
    const jsonEntrada = {
      email: '4iB0U@example.com',
      nome: 'Teste',
      convite: '123456',
      senha: '123',
    };
    const response = await request(app.getHttpServer() as Server)
      .post('/usuario')
      .send(jsonEntrada);

    const respostaCriarUsuario = response.body as {
      mensagem: string;
      nome: string;
    };
    expect(response.status).toBe(400);
    expect((response.body as { message: string[] })?.message).toContain(
      'A senha deve ter pelo menos 8 caracteres.',
    );
    expect(respostaCriarUsuario.nome).toBe(undefined);
  });

  //__ITEM: CRIA USUÁRIO COM EMAIL ERRADO E RETORNA UM ERRO //
  it('Deve tentar criar um usuário com email inválido e retornar um erro', async () => {
    const jsonEntrada = {
      email: '4iB0U',
      nome: 'Teste',
      convite: '123456',
      senha: 'Senha123456',
    };
    const response = await request(app.getHttpServer() as Server)
      .post('/usuario')
      .send(jsonEntrada);

    const respostaCriarUsuario = response.body as {
      mensagem: string;
      nome: string;
    };
    expect(response.status).toBe(400);
    expect((response.body as { message: string[] })?.message).toContain(
      'O formato do e-mail é inválido.',
    );
    expect(respostaCriarUsuario.nome).toBe(undefined);
  });

  //__ITEM: CRIA USUÁRIO COM CODIGO DE CONVITE ERRADO E RETORNA UM ERRO //
  it('Deve tentar criar um usuário com codigo de convite errado e retornar um erro', async () => {
    const jsonEntrada = {
      email: '4iB0U@example.com',
      nome: 'Teste',
      convite: '1234yy56',
      senha: 'Senha123456',
    };
    const response = await request(app.getHttpServer() as Server)
      .post('/usuario')
      .send(jsonEntrada);

    const respostaCriarUsuario = response.body as {
      mensagem: string;
      nome: string;
    };
    expect(response.status).toBe(401);
    expect((response.body as { message: string[] })?.message).toContain(
      'O seu convite não é válido',
    );
    expect(respostaCriarUsuario.nome).toBe(undefined);
  });

  //__ITEM: CRIA USUÁRIO COM CODIGO DE CONVITE USADO E RETORNA UM ERRO //
  it('Deve tentar criar um usuário com codigo de convite usado e retornar um erro', async () => {
    const jsonEntrada = {
      email: '4iB0U@example.com',
      nome: 'Teste',
      convite: '654321',
      senha: 'Senha123456',
    };
    const response = await request(app.getHttpServer() as Server)
      .post('/usuario')
      .send(jsonEntrada);

    const respostaCriarUsuario = response.body as {
      mensagem: string;
      nome: string;
    };
    expect(response.status).toBe(401);
    expect((response.body as { message: string[] })?.message).toContain(
      'O convite já foi usado',
    );
    expect(respostaCriarUsuario.nome).toBe(undefined);
  });

  //__ITEM: CRIA USUÁRIO COM EMAIL JA USADO E RETORNA UM ERRO //
  it('Deve tentar criar um usuário com email já usado e retornar um erro', async () => {
    const jsonEntrada = {
      email: 'teste@example.com',
      nome: 'Teste',
      convite: '123',
      senha: 'Senha123456',
    };
    const response = await request(app.getHttpServer() as Server)
      .post('/usuario')
      .send(jsonEntrada);

    const respostaCriarUsuario = response.body as {
      mensagem: string;
      nome: string;
    };
    expect(response.status).toBe(409);
    expect((response.body as { message: string[] })?.message).toContain(
      'O email já foi usado',
    );
    expect(respostaCriarUsuario.nome).toBe(undefined);
  });

  it('Deve tentar criar um usuário com um código de convite e o usuario criado deve herdar esse papel', async () => {
    const jsonEntrada = {
      email: 'teste2@example.com',
      nome: 'Teste',
      convite: '789',
      senha: 'Senha123456',
    };
    const response = await request(app.getHttpServer() as Server)
      .post('/usuario')
      .send(jsonEntrada);

    const respostaCriarUsuario = response.body as {
      mensagem: string;
      nome: string;
      papel: string;
    };

    const papelConvite = await prisma.convite.findUnique({
      where: { codigo: '789' },
    });

    expect(response.status).toBe(201);
    expect(respostaCriarUsuario.papel).toBe(papelConvite?.papel);
  });

  afterAll(async () => {
    await prisma.usuario.deleteMany({
      where: { email: '4iB0U@example.com' },
    });
    await prisma.usuario.deleteMany({
      where: { email: 'teste2@example.com' },
    });
    await prisma.convite.updateMany({
      where: { codigo: '123456' },
      data: { usado: false },
    });
    await prisma.convite.updateMany({
      where: { codigo: '789' },
      data: { usado: false },
    });
    await app.close();
  });
});
