import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UsuarioRepository } from '../repositories/usuario.repository';

export class AuthService {
  private usuarioRepository = new UsuarioRepository();

  public async login(email: string, senhaPura: string) {
    const usuario = await this.usuarioRepository.buscarPorEmail(email);

    if (!usuario) {
      throw new Error('Credenciais inválidas');
    }

    const senhaCorreta = await bcrypt.compare(senhaPura, usuario.senha);

    if (!senhaCorreta) {
      throw new Error('Credenciais inválidas');
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('Erro de configuração do servidor');
    }

    const token = jwt.sign(
      { id: usuario.id }, // O "Payload" (dados que vão dentro do token)
      secret,             // A chave secreta que assina o token
      { expiresIn: '1d' } // Validade do token (1 dia)
    );

    return token;
  }
}