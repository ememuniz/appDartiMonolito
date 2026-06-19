// Test usado para testar o usuário
// TestingModule usado para testar o módulo
// INestApplication usado para testar a aplicação Nest
// request usado para testar a requisição
// supertest é uma biblioteca para testar a requisição]
// AppModule está aqui porque é o módulo principal e vai incluir todo o backend
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { Server } from 'http';

//_ITEM: TESTES DE USUÁRIOS //
describe('Testes de Usuários', () => {
  //__ITEM: DECLARAÇÃO DE VARIAVEL DE APP SIMULADO //
  // Aqui é criado uma variável app que será uma simulação de uma aplicação Nest
  let app: INestApplication;
  //__ITEM: CONFIGURAÇÃO DO SERVIDOR //
  beforeAll(async () => {
    //___ITEM: CRIA UM MÓDULO TEST
    // No módulo test, vamos incluir o módulo principal pra simular o backend
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    //___ITEM: CRIA A APLICACAO SIMULADA //
    app = module.createNestApplication();
    await app.init();
  });

  //__ITEM: CRIA USUÁRIO COM SUCESSO //
  it('Deve criar um usuário no banco de dados com sucesso', async () => {
    //___ITEM: CRIA UM USUÁRIO FAKE PARA PASSAR COMO ENTRADA //
    const jsonEntrada = {
      email: '4iB0U@example.com',
      nome: 'Teste',
      convite: '123456',
      password: '123456',
    };

    //___ITEM: FAZ A REQUISICAO POST PARA CRIAR O USUÁRIO E ENVIA O USUÁRIO FAKE COMO CORPO //
    const response = await request(app.getHttpServer() as Server)
      .post('/usuario')
      .send(jsonEntrada);

    //___ITEM: DEFINE O TIPO DA RESPOSTA //
    const respostaCriarUsuario = response.body as {
      id: string;
      mensagem: string;
      nome: string;
    };
    expect(response.status).toBe(201);
    expect(respostaCriarUsuario).toHaveProperty('id');
    expect(respostaCriarUsuario.nome).toBe(jsonEntrada.nome);
  });
});
