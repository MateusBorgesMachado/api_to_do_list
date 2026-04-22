import { randomUUID } from "crypto";
import { prisma } from "../database/prisma.repository";
import type { CriarUsuarioDTO } from "../dtos/criar-usuario.dto";


export class UsuarioRepository {
    //C - criar
    public async criar(dados: CriarUsuarioDTO) {
        const usuario = await prisma.usuario.create({
            data: {
                id: randomUUID(),
                nome: dados.nome,
                email: dados.email,
                senha: dados.senha

            }
        })
        return usuario;
    }

    //R - Ler
    public async buscarPorEmail(email: string) {
        const usuario = await prisma.usuario.findUnique({
            where: {
                email: email
            }
        })
        return usuario
    }

    public async buscarPorId(id: string) {
    const usuario = await prisma.usuario.findUnique({
      where: { id }
    });
    
    return usuario;
  }

  public async listar() {
    return await prisma.usuario.findMany();
  }

  // U
  public async atualizar(id: string, dadosParaAtualizar: any) {
    const usuarioAtualizado = await prisma.usuario.update({
      where: { id },
      data: dadosParaAtualizar
    });
    return usuarioAtualizado;
  }

  // D
}