import type { Response } from "express";

enum messageMap {
    "Operação realizada com sucesso" = 200,
    "Registro cadastrado com sucesso" = 201,
    "Registro não encontrado" = 404,
    "Requisição inválida. Verifique os parametros e tente novamente" = 400,
    "Ops! Ocorreu um erro inesperado no servidor." = 500
}

export default function httpResponse<T>(res: Response, statusCode: number, data?: T) {
    return res.status(statusCode).json({
        message: messageMap[statusCode],
        data: data
    })
}