import { expect } from 'chai';
import { api } from '../helpers/api.js';
import {
  loginComoAdmin,
  loginComoAluno
} from '../helpers/auth.js';
import cenarios from '../fixtures/entregas-trabalhos.json' with {
  type: 'json'
};

describe('Fluxo de entrega de trabalho', () => {

  cenarios.forEach((cenario) => {
    it(cenario.tituloTeste, async () => {
      const tokenAdmin = await loginComoAdmin();
      expect(tokenAdmin).to.be.a('string').and.not.empty; 

      const cadastrarAluno = await api()
        .post('/api/admin/alunos')
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send(cenario.aluno)

      expect(cadastrarAluno.status).to.equal(201);
      expect(cadastrarAluno.body.nome).to.equal(cenario.aluno.nome);
      expect(cadastrarAluno.body.email).to.equal(cenario.aluno.email);      
   
      const alunoId = cadastrarAluno.body.id
      

    const cadastrarDisciplina = await api()
        .post('/api/admin/disciplinas')
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send(cenario.disciplina);

    expect(cadastrarDisciplina.status).to.equal(201);
    expect(cadastrarDisciplina.body.nome).to.equal(cenario.disciplina.nome);

    const disciplinaId = cadastrarDisciplina.body.id;
   
   
    const matricularAlunoNaDisciplina = await api()
        .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send({ alunoId });

    expect(matricularAlunoNaDisciplina.status).to.equal(201);
    expect(matricularAlunoNaDisciplina.body.alunoId).to.equal(alunoId);
    expect(matricularAlunoNaDisciplina.body.disciplinaId).to.equal(disciplinaId);
   
    const tokenAluno = await loginComoAluno(cenario.aluno.email, cenario.aluno.senha);
    expect(tokenAluno).to.be.a('string').and.not.empty;

    const entregaTrabalho = await api()
        .post(`/api/alunos/${alunoId}/trabalhos`)
        .set('Authorization', `Bearer ${tokenAluno}`)
        .send({
          disciplinaId,
          titulo: cenario.trabalho.titulo,
          descricao: cenario.trabalho.descricao
        });

      expect(entregaTrabalho.status).to.equal(cenario.statusEsperado);
      expect(entregaTrabalho.body.id).to.be.a('string').and.not.empty;
      expect(entregaTrabalho.body.alunoId).to.equal(alunoId);
      expect(entregaTrabalho.body.disciplinaId).to.equal(disciplinaId);
      expect(entregaTrabalho.body.titulo).to.equal(cenario.trabalho.titulo);
      expect(entregaTrabalho.body.status).to.equal('entregue');

   
    });
  });
});