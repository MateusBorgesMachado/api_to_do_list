import { prisma } from "../database";
import type { CriarTarefaDTO } from "../dtos/criar-tarefa.dto";
import { Status } from "../generated/prisma/enums";

export class TarefaRepository {
    //C - criar
    public async criar(id: string, titulo: string, descricao: string, usuarioId: string) {
        const tarefa = await prisma.tarefa.create({
            data: {
                id,
                titulo,
                descricao,
                usuarioId,
            }
        });

        return tarefa;
    }

    //R - ler
    public async listarPorUsuario(usuarioId: string) {
        const tarefas = await prisma.tarefa.findMany({
            where: {
                usuarioId: usuarioId
            }
        });
        return tarefas;
    }

    public async buscarPorIdEUsuario(id: string, usuarioId: string) {
        const tarefa = await prisma.tarefa.findFirst({
            where: {
                id: id,
                usuarioId: usuarioId
            }
        });
        return tarefa;
    }

    public async listarPorStatus(status: Status, usuarioId: string) {
        const tarefas = await prisma.tarefa.findMany({
            where: {
                usuarioId: usuarioId,
                status: status
            }
        });
        return tarefas;
    }

    public async buscarPorTitulo(titulo: string, usuarioId: string) {
        const tarefas = await prisma.tarefa.findMany({
            where: {
                usuarioId: usuarioId, // Segurança: só as dele
                titulo: {
                    contains: titulo,       // Busca o termo dentro do título
                    mode: 'insensitive'    // Ignora se é Maiúscula ou Minúscula
                }
            }
        });
        return tarefas;
    }

    public async listarPaginado(usuarioId: string, skip: number, take: number) {
        return await prisma.tarefa.findMany({
            where: { usuarioId },
            skip: skip,
            take: take,
        });
    }

    public async contarTotal(usuarioId: string) {
        return await prisma.tarefa.count({
            where: { usuarioId }
        });
    }

    //U - atualizar
    public async atualizar(id: string, dadosParaAtualizar: any) {
        const tarefaAtualizada = await prisma.tarefa.update({
            where: { id: id },
            data: dadosParaAtualizar
        });
        return tarefaAtualizada;
    }

    //D - deletar
    public async remover(id: string) {
        await prisma.tarefa.delete({
            where: { id: id }
        });
    }
}