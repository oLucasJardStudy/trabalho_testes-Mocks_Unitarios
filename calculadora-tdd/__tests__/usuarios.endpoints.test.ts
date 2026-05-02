import request from 'supertest';
import { createApp, Usuario } from '../src/app';

describe('Endpoints de usuários', () => {
  const seed: Usuario[] = [
    { id: 1, nome: 'Ana', email: 'ana@example.com' },
    { id: 2, nome: 'Bruno', email: 'bruno@example.com' },
  ];

  describe('Listagem de usuários', () => {
    it('GET /usuarios deve retornar lista vazia quando não há usuários', async () => {
      const app = createApp([]);
      const res = await request(app).get('/usuarios');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('GET /usuarios com createApp() sem argumentos inicia vazio', async () => {
      const app = createApp();
      const res = await request(app).get('/usuarios');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('GET /usuarios deve retornar todos os usuários', async () => {
      const app = createApp(seed);
      const res = await request(app).get('/usuarios');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 1, nome: 'Ana' }),
          expect.objectContaining({ id: 2, nome: 'Bruno' }),
        ]),
      );
    });
  });

  describe('Visualização de usuário', () => {
    it('GET /usuarios/:id deve retornar um usuário existente', async () => {
      const app = createApp(seed);
      const res = await request(app).get('/usuarios/1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ id: 1, nome: 'Ana', email: 'ana@example.com' });
    });

    it('GET /usuarios/:id deve retornar 404 quando o usuário não existe', async () => {
      const app = createApp(seed);
      const res = await request(app).get('/usuarios/99');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Usuário não encontrado' });
    });

    it('GET /usuarios/:id deve retornar 400 quando o ID não é numérico', async () => {
      const app = createApp(seed);
      const res = await request(app).get('/usuarios/abc');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'ID inválido' });
    });
  });

  describe('Criação de usuário', () => {
    it('POST /usuarios deve criar usuário e retornar 201', async () => {
      const app = createApp([]);
      const res = await request(app)
        .post('/usuarios')
        .send({ nome: 'Carla', email: 'carla@example.com' });
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        id: 1,
        nome: 'Carla',
        email: 'carla@example.com',
      });
      const list = await request(app).get('/usuarios');
      expect(list.body).toHaveLength(1);
    });

    it('POST /usuarios deve retornar 400 sem nome ou email', async () => {
      const app = createApp([]);
      const res = await request(app).post('/usuarios').send({ nome: 'Sem email' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'nome e email são obrigatórios' });
    });

    it('POST /usuarios deve retornar 400 quando falta apenas o nome', async () => {
      const app = createApp([]);
      const res = await request(app).post('/usuarios').send({ email: 'so@email.com' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'nome e email são obrigatórios' });
    });

    it('POST /usuarios deve retornar 400 com corpo vazio', async () => {
      const app = createApp([]);
      const res = await request(app).post('/usuarios').send({});
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'nome e email são obrigatórios' });
    });

    it('POST /usuarios deve retornar 400 com nome ou email em branco', async () => {
      const app = createApp([]);
      const semNome = await request(app)
        .post('/usuarios')
        .send({ nome: '', email: 'a@b.com' });
      expect(semNome.status).toBe(400);

      const semEmail = await request(app)
        .post('/usuarios')
        .send({ nome: 'Fulano', email: '' });
      expect(semEmail.status).toBe(400);
    });

    it('POST /usuarios deve usar próximo id com base no maior id inicial', async () => {
      const app = createApp([
        { id: 50, nome: 'Velho', email: 'v@e.com' },
        { id: 100, nome: 'MaisVelho', email: 'm@v.com' },
      ]);
      const res = await request(app)
        .post('/usuarios')
        .send({ nome: 'Novo', email: 'novo@example.com' });
      expect(res.status).toBe(201);
      expect(res.body.id).toBe(101);
    });

    it('POST /usuarios deve incrementar ids em sequência', async () => {
      const app = createApp([]);
      const a = await request(app).post('/usuarios').send({ nome: 'A', email: 'a@x.com' });
      const b = await request(app).post('/usuarios').send({ nome: 'B', email: 'b@x.com' });
      expect(a.body.id).toBe(1);
      expect(b.body.id).toBe(2);
      const list = await request(app).get('/usuarios');
      expect(list.body).toHaveLength(2);
    });
  });

  describe('Exclusão de usuário', () => {
    it('DELETE /usuarios/:id deve remover usuário e retornar 204', async () => {
      const app = createApp(seed);
      const res = await request(app).delete('/usuarios/1');
      expect(res.status).toBe(204);
      const list = await request(app).get('/usuarios');
      expect(list.body).toHaveLength(1);
      expect(list.body[0].id).toBe(2);
    });

    it('DELETE /usuarios/:id com corpo vazio na resposta', async () => {
      const app = createApp([{ id: 1, nome: 'Só', email: 's@o.com' }]);
      const res = await request(app).delete('/usuarios/1');
      expect(res.status).toBe(204);
      expect(res.text).toBe('');
      const list = await request(app).get('/usuarios');
      expect(list.body).toEqual([]);
    });

    it('DELETE /usuarios/:id deve retornar 404 quando o usuário não existe', async () => {
      const app = createApp(seed);
      const res = await request(app).delete('/usuarios/99');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Usuário não encontrado' });
    });

    it('DELETE /usuarios/:id deve retornar 400 quando o ID não é numérico', async () => {
      const app = createApp(seed);
      const res = await request(app).delete('/usuarios/xyz');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'ID inválido' });
    });
  });
});
