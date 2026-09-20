import request from 'supertest';
import { expect } from 'chai';
import { getToken } from '../helpers/auth.js';

describe('Cadastro de alunos', () => {
  let token;

  beforeEach(async () => {
    token = await getToken('admin@escola.com', 'admin123');
  });

  it('deve cadastrar um aluno quando ele informa dados válidos', async () => {
    const identificador = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const aluno = {
      nome: 'Wedney Silva',
      email: `wedney.silva.${identificador}@example.com`,
      matricula: `2026-${identificador}`,
      senha: '123456'
    };

    const resposta = await request('http://localhost:3000')
      .post('/api/admin/alunos')
      .set('Authorization', `Bearer ${token}`)
      .send(aluno);

    expect(resposta.status).to.equal(201);
    expect(resposta.body.nome).to.equal(aluno.nome);
    expect(resposta.body.email).to.equal(aluno.email);
    expect(resposta.body.matricula).to.equal(aluno.matricula);
  });

  it('deve negar o cadastro de um aluno quando ele já existe', async () => {
    const resposta = await request('http://localhost:3000')
      .post('/api/admin/alunos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Ana Souza',
        email: 'ana.souza@example.com',
        matricula: '2024001',
        senha: '123456'
      });

    expect(resposta.status).to.equal(409);
  });
});
