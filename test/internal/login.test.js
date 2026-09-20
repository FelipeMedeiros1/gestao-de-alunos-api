import request from 'supertest';
import app from '../../src/app.js';
import { expect } from 'chai';
import * as sinon from 'sinon';
import db from '../../src/database/db.js';

describe('Login', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('deve retornar 200 quando o usuário e senha forem corretos', async () => {
    const resposta = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@escola.com', senha: 'admin123' });

    expect(resposta.status).to.equal(200);
  });

  it('deve retornar 400 quando a senha não for informada', async () => {
    const resposta = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@escola.com', senha: '' });

    expect(resposta.status).to.equal(400);
  });

  it('deve retornar 401 quando a senha for incorreta', async () => {
    const resposta = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@escola.com', senha: 'admin124' });

    expect(resposta.status).to.equal(401);
  });

  it('deve retornar 500 quando acontecer algum problema de conexão com o banco de dados', async () => {
    sinon.stub(db, 'all').throws(new Error('Erro catastrófico!'));

    const resposta = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@escola.com', senha: 'admin123' });

    expect(resposta.status).to.equal(500);
    expect(resposta.body.error).to.equal('Erro interno do servidor.');
  });
});
