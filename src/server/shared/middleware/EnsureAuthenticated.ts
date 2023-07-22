import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { JWTService } from "../services";

/**
 * Middleware que garante que o usuário está autenticado 
 *      através do token JWT presente no cabeçalho da requisição.
 */
export const ensureAuthenticated: RequestHandler = async (req, res, next) => {

    // Obtém o cabeçalho 'authorization' da requisição.
    const { authorization } = req.headers;

    // Verifica se o cabeçalho 'authorization' não está presente na requisição.
    if (!authorization) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: { default: "Não autenticado" }
        });
    }

    // Divide o cabeçalho 'authorization' em um array com duas posições: o tipo de autenticação e o token JWT.
    const [type, token] = authorization.split(" ");

    // Verifica se o tipo de autenticação não é 'Bearer'.
    if (type !== "Bearer") {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: { default: "Não autenticado" }
        });
    }
    
    // Verifica se o token JWT é válido e decodifica suas informações.
    const jwtData = JWTService.verify(token);

    // Verifica se ocorreu um erro interno na validação do token JWT.
    if (jwtData === "JWT_SECRET_NOT_FOUND") {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: { default: "Erro ao validar token de acesso" }
        });
    } 
    
    // Verifica se o token JWT é inválido.
    if (jwtData === "INVALID_TOKEN") {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: { default: "Token inválido" }
        });
    }

    // torna o id do usuário acessivel para as outras function na cadeia de execução.
    req.headers.idUsuario = jwtData.uid.toString();

    return next();
};