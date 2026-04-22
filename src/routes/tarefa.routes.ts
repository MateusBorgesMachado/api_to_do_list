import { Router } from 'express';
import { TarefaController } from '../controllers/tarefa.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const tarefaRoutes = Router();
const tarefaController = new TarefaController();

tarefaRoutes.post('/', authMiddleware, tarefaController.criar);

tarefaRoutes.get('/titulo/:titulo', authMiddleware, tarefaController.buscarPorTitulo);
tarefaRoutes.get('/', authMiddleware, tarefaController.listar);
tarefaRoutes.get('/status/:status', authMiddleware, tarefaController.listarPorStatus);
tarefaRoutes.get('/:id', authMiddleware, tarefaController.buscarPorId);

tarefaRoutes.put('/:id', authMiddleware, tarefaController.atualizar);
tarefaRoutes.patch('/:id/:status', authMiddleware, tarefaController.atualizarStatus);

tarefaRoutes.delete('/:id', authMiddleware, tarefaController.remover);

export { tarefaRoutes };