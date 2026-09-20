import 'dotenv/config';
import { api } from './api.js';

export async function loginComoAdmin() {
  const resposta = await api()
    .post('/api/auth/login')
    .send({
      email: process.env.ADMIN_EMAIL,
      senha: process.env.ADMIN_SENHA
    });

  if (resposta.status !== 200 || !resposta.body.token) {
    throw new Error(`Falha no login do administrador: status ${resposta.status}`);
  }

  return resposta.body.token;
}

export async function loginComoAluno(email, senha) {
  const resposta = await api()
    .post('/api/auth/login')
    .send({ email, senha });

  if (resposta.status !== 200 || !resposta.body.token) {
    throw new Error(`Falha no login do aluno: status ${resposta.status}`);
  }

  return resposta.body.token;
}

export const getToken = loginComoAluno;

export async function comTokenDeAdmin() {
  return `Bearer ${await loginComoAdmin()}`;
}
