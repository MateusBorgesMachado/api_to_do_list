import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller';

const usuarioRoutes = Router();
const usuarioController = new UsuarioController();

usuarioRoutes.post('/', usuarioController.criar);

usuarioRoutes.get('/:id', usuarioController.buscarPorId);
usuarioRoutes.get('/email/:email', usuarioController.buscarPorEmail);
usuarioRoutes.get('/', usuarioController.listarTodos);

usuarioRoutes.put('/:id', usuarioController.atualizar);

export { usuarioRoutes };