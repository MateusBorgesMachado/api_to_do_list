import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import httpResponse from '../utils/http.response';

export interface AuthRequest extends Request {
  usuarioId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return httpResponse(res, 401, { mensagem: 'Token não fornecido.' });
  }

  const [, token] = authHeader.split(' ');

  if (!token) {
    return httpResponse(res, 401, { mensagem: 'Token mal formatado.' });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('Erro interno do servidor: JWT_SECRET ausente');
    }

    const decoded = jwt.verify(token, secret) as { id: string };

    req.usuarioId = decoded.id;

    return next();
    
  } catch (error) {
    return httpResponse(res, 401, { mensagem: 'Token inválido ou expirado.' });
  }
};