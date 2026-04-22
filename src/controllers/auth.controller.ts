import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import httpResponse from '../utils/http.response';

export class AuthController {
    private authService = new AuthService();

    public login = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return httpResponse(res, 400, { detalhe: 'E-mail e senha são obrigatórios.' });
            }

            const token = await this.authService.login(email, senha);


            return httpResponse(res, 200, { token });

        } catch (error: any) {

            if (error.message === 'Credenciais inválidas') {

                return httpResponse(res, 401, {
                    email: req.body,
                    senha: req.body,
                    mensagem: error.message
                });
            }
            console.error(error);
            return httpResponse(res, 500);
        }
    };
}