import type { Request, Response } from 'express';
import { UsuarioService } from '../services/usuario.service';
import httpResponse from '../utils/http.response';

export class UsuarioController {
  private usuarioService = new UsuarioService();

  public criar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { nome, email, senha } = req.body;

      if (!nome || !email || !senha) {
        return httpResponse(res, 400);
      }
      
      if (senha.length < 6) {
        return httpResponse(res, 400);
      }

      const novoUsuario = await this.usuarioService.criar({ nome, email, senha });

      return httpResponse(res, 201, novoUsuario);

    } catch (error: any) {
      if (error.mensagem === 'Email já cadastrado') {
        return httpResponse(res, 409, {
            email: req.body,
            mensagem: error.mensagem
        });
      }
      console.error(error);
      return httpResponse(res, 500); 
    }
  }

  public buscarPorId = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        return httpResponse(res, 400, { mensagem: 'O ID informado é inválido.' });
      }

      const usuario = await this.usuarioService.buscarPorId(id);

      return httpResponse(res, 200, usuario);

    } catch (error: any) {
      if (error.mensagem === 'Usuário não encontrado') {
        return httpResponse(res, 404, { detalhe: error.mensagem });
      }
      
      console.error(error);
      return httpResponse(res, 500);
    }
  };

  public buscarPorEmail = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email } = req.params;

      if (!email || typeof email !== 'string') {
        return httpResponse(res, 400, { detalhe: 'O e-mail informado é inválido.' });
      }

      const usuario = await this.usuarioService.buscarPorEmail(email);

      return httpResponse(res, 200, usuario);

    } catch (error: any) {
      if (error.message === 'Usuário não encontrado') {
        return httpResponse(res, 404, { detalhe: error.message });
      }
      
      console.error(error);
      return httpResponse(res, 500);
    }
  };

  public listarTodos = async (req: Request, res: Response): Promise<Response> => {
    try {
      const usuarios = await this.usuarioService.listarTodos();

      return httpResponse(res, 200, usuarios);

    } catch (error: any) {
      console.error(error);
      
      return httpResponse(res, 500);
    }
  };

  public atualizar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const { nome, email, senha } = req.body;

      if (!id || typeof id !== 'string') {
        return httpResponse(res, 400, { mensagem: 'O ID informado é inválido.' });
      }

      if (!nome && !email && !senha) {
        return httpResponse(res, 400, { mensagem: 'Envie pelo menos um campo (nome, email ou senha) para atualizar.' });
      }

      const usuarioAtualizado = await this.usuarioService.atualizar(id, { nome, email, senha });

      return httpResponse(res, 200, usuarioAtualizado);

    } catch (error: any) {
      if (error.message === 'Usuário não encontrado') {
        return httpResponse(res, 404, { mensagem: error.message });
      }
      if (error.message === 'Este e-mail já está em uso por outro usuário') {
        return httpResponse(res, 409, { mensagem: error.message });
      }
      
      console.error(error);
      return httpResponse(res, 500);
    }
  };
}