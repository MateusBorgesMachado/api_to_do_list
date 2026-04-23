import type { Response } from 'express';
import type { AuthRequest } from '../middlewares/auth.middleware';
import { TarefaService } from '../services/tarefa.service';
import httpResponse from '../utils/http.response';
import { Status } from '../generated/prisma/enums';

export class TarefaController {
    private tarefaService = new TarefaService();

    public criar = async (req: AuthRequest, res: Response): Promise<Response> => {
        try {
            const { titulo, descricao } = req.body;

            const usuarioId = req.usuarioId;

            if (!titulo || !descricao) {
                return httpResponse(res, 400, { mensagem: 'Título e descrição são obrigatórios.' });
            }

            if (!usuarioId) {
                return httpResponse(res, 401, { mensagem: 'Usuário não autenticado.' });
            }

            const tarefa = await this.tarefaService.criar(titulo, descricao, usuarioId);

            return httpResponse(res, 201, tarefa);

        } catch (error: any) {
            if (error.message.includes('Status inválido')) {
                return httpResponse(res, 400, { mensagem: error.message });
            }

            console.error(error);
            return httpResponse(res, 500);
        }
    };

    public listar = async (req: AuthRequest, res: Response): Promise<Response> => {
        try {
            const usuarioId = req.usuarioId;

            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            if (!usuarioId) {
                return httpResponse(res, 401, { mensagem: 'Usuário não autenticado.' });
            }

            const resultado = await this.tarefaService.listarComPaginacao(usuarioId, page, limit);

            return httpResponse(res, 200, resultado);

        } catch (error: any) {
            console.error(error);
            return httpResponse(res, 500);
        }
    };

    public buscarPorId = async (req: AuthRequest, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const usuarioId = req.usuarioId;

            if (!id || typeof id !== 'string') {
                return httpResponse(res, 400, { mensagem: 'O ID informado é inválido.' });
            }

            if (!usuarioId) {
                return httpResponse(res, 401, { mensagem: 'Usuário não autenticado.' });
            }

            const tarefa = await this.tarefaService.buscarPorId(id, usuarioId);

            return httpResponse(res, 200, tarefa);

        } catch (error: any) {
            if (error.message.includes('não encontrada')) {
                return httpResponse(res, 404, { mensagem: error.message });
            }
            console.error(error);
            return httpResponse(res, 500);
        }
    };

    public listarPorStatus = async (req: AuthRequest, res: Response): Promise<Response> => {
        try {
            const { status } = req.params;
            const usuarioId = req.usuarioId;

            if (!status) {
                return httpResponse(res, 400, { mensagem: 'O status informado é inválido.' });
            }

            if (!usuarioId) {
                return httpResponse(res, 401, { mensagem: 'Usuário não autenticado.' });
            }

            if (!Object.values(Status).includes(status as Status)) {
                return httpResponse(res, 400, { mensagem: 'Status informado é inválido.' });
            }

            const tarefas = await this.tarefaService.listarPorStatus(status as Status, usuarioId);

            return httpResponse(res, 200, tarefas);

        } catch (error: any) {
            if (error.message.includes('Status inválido')) {
                return httpResponse(res, 400, { mensagem: error.message });
            }
            console.error(error);
            return httpResponse(res, 500);
        }
    };

    public buscarPorTitulo = async (req: AuthRequest, res: Response): Promise<Response> => {
        try {
            const { titulo } = req.params;
            const usuarioId = req.usuarioId;

            if (!usuarioId) {
                return httpResponse(res, 401, { mensagem: 'Usuário não autenticado.' });
            }

            const tarefas = await this.tarefaService.buscarPorTitulo(String(titulo), usuarioId);

            return httpResponse(res, 200, tarefas);

        } catch (error: any) {
            if (error.message.includes('termo de busca')) {
                return httpResponse(res, 400, { mensagem: error.message });
            }
            console.error(error);
            return httpResponse(res, 500);
        }
    };

    public atualizar = async (req: AuthRequest, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const { titulo, descricao, status } = req.body;
            const usuarioId = req.usuarioId;

            if (!id || typeof id !== 'string') {
                return httpResponse(res, 400, { mensagem: 'O ID informado é inválido.' });
            }

            if (!usuarioId) {
                return httpResponse(res, 401, { mensagem: 'Usuário não autenticado.' });
            }

            if (!titulo && !descricao && !status) {
                return httpResponse(res, 400, { mensagem: 'Nenhum dado fornecido para atualização.' });
            }

            const tarefaAtualizada = await this.tarefaService.atualizar(id, usuarioId, { titulo, descricao, status });

            return httpResponse(res, 200, tarefaAtualizada);

        } catch (error: any) {
            if (error.message.includes('não encontrada')) {
                return httpResponse(res, 404, { mensagem: error.message });
            }
            if (error.message.includes('Status inválido')) {
                return httpResponse(res, 400, { mensagem: error.message });
            }
            console.error(error);
            return httpResponse(res, 500);
        }
    };

    public atualizarStatus = async (req: AuthRequest, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const usuarioId = req.usuarioId;

            if (!id || typeof id !== 'string') {
                return httpResponse(res, 400, { mensagem: 'O ID informado é inválido.' });
            }

            if (!usuarioId) {
                return httpResponse(res, 401, { mensagem: 'Usuário não autenticado.' });
            }

            if (!status) {
                return httpResponse(res, 400, { mensagem: 'O campo status é obrigatório na requisição.' });
            }

            const tarefaAtualizada = await this.tarefaService.atualizarStatus(id, usuarioId, status);

            return httpResponse(res, 200, tarefaAtualizada);

        } catch (error: any) {
            if (error.message.includes('não encontrada')) {
                return httpResponse(res, 404, { mensagem: error.message });
            }
            if (error.message.includes('Status inválido') || error.message.includes('obrigatório')) {
                return httpResponse(res, 400, { mensagem: error.message });
            }
            console.error(error);
            return httpResponse(res, 500);
        }
    };

    public remover = async (req: AuthRequest, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const usuarioId = req.usuarioId;

            if (!id || typeof id !== 'string') {
                return httpResponse(res, 400, { mensagem: 'O ID informado é inválido.' });
            }

            if (!usuarioId) {
                return httpResponse(res, 401, { mensagem: 'Usuário não autenticado.' });
            }

            const tarefaDeletada = await this.tarefaService.remover(id, usuarioId);

            return httpResponse(res, 200, tarefaDeletada);

        } catch (error: any) {
            if (error.message.includes('não encontrada')) {
                return httpResponse(res, 404, { mensagem: error.message });
            }

            console.error(error);
            return httpResponse(res, 500);
        }
    };
}