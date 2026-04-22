import bcrypt from 'bcrypt';
import { UsuarioRepository } from '../repositories/usuario.repository';
import type { CriarUsuarioDTO } from '../dtos/criar-usuario.dto.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

export class UsuarioService {
    private usuarioRepository = new UsuarioRepository();

    public async criar(dados: CriarUsuarioDTO) {
        try {
            const emailExiste = await this.usuarioRepository.buscarPorEmail(dados.email);
            if (emailExiste) throw new Error("Email já cadastrado");

            const saltRounds = 10; // O custo do processamento (10 é o padrão seguro e rápido)
            const senhaHasheada = await bcrypt.hash(dados.senha, saltRounds);

            const dadosSeguros = {
                nome: dados.nome,
                email: dados.email,
                senha: senhaHasheada
            };

            const usuarioSalvo = await this.usuarioRepository.criar(dadosSeguros);

            return usuarioSalvo;

        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                if (e.code === "P2002") {
                    console.log(
                        "There is a unique constraint violation, a new user cannot be created with this email",
                    );
                }
            }
            throw e;
        }
    }

    public async buscarPorId(id: string) {
        const usuario = await this.usuarioRepository.buscarPorId(id);

        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        const { senha, ...usuarioSemSenha } = usuario;

        return usuarioSemSenha;
    }

    public async buscarPorEmail(email: string) {
        const usuario = await this.usuarioRepository.buscarPorEmail(email);

        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        const { senha, ...usuarioSemSenha } = usuario;

        return usuarioSemSenha;
    }

    public async listarTodos() {
        const usuarios = await this.usuarioRepository.listar();

        const usuariosSemSenha = usuarios.map((usuario: { id: string; nome: string; email: string; senha: string }) => {
            const { senha, ...usuarioSeguro } = usuario;
            return usuarioSeguro;
        });

        return usuariosSemSenha;
    }

    public async atualizar(id: string, dados: { nome?: string; email?: string; senha?: string }) {
    const usuarioAtual = await this.buscarPorId(id);

    if (dados.email && dados.email !== usuarioAtual.email) {
      const emailEmUso = await this.usuarioRepository.buscarPorEmail(dados.email);
      if (emailEmUso) {
        throw new Error('Este e-mail já está em uso por outro usuário');
      }
    }

    let senhaProcessada = dados.senha;
    if (dados.senha) {
      senhaProcessada = await bcrypt.hash(dados.senha, 10);
    }

    const dadosAtualizados = {
      nome: dados.nome,
      email: dados.email,
      senha: senhaProcessada,
    };

    const usuarioAtualizado = await this.usuarioRepository.atualizar(id, dadosAtualizados);

    const { senha, ...usuarioSeguro } = usuarioAtualizado;
    return usuarioSeguro;
  }
}