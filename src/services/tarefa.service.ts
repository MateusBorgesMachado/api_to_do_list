import { randomUUID } from 'node:crypto';
import { TarefaRepository } from '../repositories/tarefa.repository';
import { Status } from '../generated/prisma/enums';

export class TarefaService {
    private tarefaRepository = new TarefaRepository();

    public async criar(titulo: string, descricao: string, usuarioId: string) {
        const id = randomUUID();
        const tarefa = await this.tarefaRepository.criar(id, titulo, descricao, usuarioId);

        return tarefa;
    }

    public async listarPorUsuario(usuarioId: string) {
        const tarefas = await this.tarefaRepository.listarPorUsuario(usuarioId);
        return tarefas;
    }

    public async buscarPorId(id: string, usuarioId: string) {
        const tarefa = await this.tarefaRepository.buscarPorIdEUsuario(id, usuarioId);

        if (!tarefa) {
            throw new Error('Tarefa não encontrada ou você não tem permissão para acessá-la.');
        }

        return tarefa;
    }

    public async listarPorStatus(status: Status, usuarioId: string) {
        const statusValidos = ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA'];

        if (!statusValidos.includes(status)) {
            throw new Error('Status inválido. Use: PENDENTE, EM_ANDAMENTO ou CONCLUIDA.');
        }

        const tarefas = await this.tarefaRepository.listarPorStatus(status, usuarioId);
        return tarefas;
    }

    public async buscarPorTitulo(titulo: string, usuarioId: string) {
        if (!titulo) {
            throw new Error('É necessário informar um termo de busca.');
        }

        const tarefas = await this.tarefaRepository.buscarPorTitulo(titulo, usuarioId);
        return tarefas;
    }

    public async listarComPaginacao(usuarioId: string, page: number, limit: number) {
        const skip = (page - 1) * limit;

        const [tarefas, total] = await Promise.all([
            this.tarefaRepository.listarPaginado(usuarioId, skip, limit),
            this.tarefaRepository.contarTotal(usuarioId)
        ]);

        return {
            data: tarefas,
            meta: {
                totalItems: total,
                totalPaginas: Math.ceil(total / limit),
                paginaAtual: page,
                itensPorPagina: limit
            }
        };
    }

    public async atualizar(id: string, usuarioId: string, dados: { titulo?: string; descricao?: string; status?: string }) {
        await this.buscarPorId(id, usuarioId);

        if (dados.status) {
            const statusValidos = ['pendente', 'em_andamento', 'concluida'];
            if (!statusValidos.includes(dados.status)) {
                throw new Error('Status inválido. Use: pendente, em_andamento ou concluida.');
            }
        }

        const dadosAtualizados = {
            titulo: dados.titulo || undefined,
            descricao: dados.descricao || undefined,
            status: dados.status || undefined,
        };

        const tarefaAtualizada = await this.tarefaRepository.atualizar(id, dadosAtualizados);

        return tarefaAtualizada;
    }

    public async atualizarStatus(id: string, usuarioId: string, status: string) {
        await this.buscarPorId(id, usuarioId);

        if (!status) {
            throw new Error('O status é obrigatório para esta ação.');
        }

        const statusValidos = ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA'];
        if (!statusValidos.includes(status)) {
            throw new Error('Status inválido. Use: PENDENTE, EM_ANDAMENTO ou CONCLUIDA.');
        }

        const tarefaAtualizada = await this.tarefaRepository.atualizar(id, { status });

        return tarefaAtualizada;
    }

    public async remover(id: string, usuarioId: string) {
        return await this.buscarPorId(id, usuarioId);

        await this.tarefaRepository.remover(id);
    }
}