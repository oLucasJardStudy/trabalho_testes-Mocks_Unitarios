import express, { Express } from 'express';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
}

/**
 * Cria a aplicação Express com rotas de usuários e estado isolado (útil em testes).
 */
export function createApp(initial: Usuario[] = []): Express {
  const usuarios: Usuario[] = [...initial];
  let nextId =
    usuarios.length > 0 ? Math.max(...usuarios.map((u) => u.id), 0) + 1 : 1;

  const app = express();
  app.use(express.json());

  app.get('/usuarios', (_req, res) => {
    res.json(usuarios);
  });

  app.get('/usuarios/:id', (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }
    const usuario = usuarios.find((u) => u.id === id);
    if (!usuario) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }
    res.json(usuario);
  });

  app.post('/usuarios', (req, res) => {
    const { nome, email } = req.body as { nome?: string; email?: string };
    if (!nome || !email) {
      res.status(400).json({ message: 'nome e email são obrigatórios' });
      return;
    }
    const novo: Usuario = { id: nextId++, nome, email };
    usuarios.push(novo);
    res.status(201).json(novo);
  });

  app.delete('/usuarios/:id', (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }
    const index = usuarios.findIndex((u) => u.id === id);
    if (index === -1) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }
    usuarios.splice(index, 1);
    res.status(204).send();
  });

  return app;
}
