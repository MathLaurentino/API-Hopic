import { Request, Response } from "express";
import { validation } from "../../shared/middleware";
import * as yup from "yup";
import { UsuarioProvider } from "../../database/providers/usuarios";
import { StatusCodes } from "http-status-codes";
import { InternalServerError, JWTService, PasswordCrypto, UnauthorizedError } from "../../shared/services";


/**
 * Propriedades da requisição do endpoint de signIn.
 * Contém as propriedades do corpo da requisição
 */
interface IBodyProps {
    email: string;
    senha:string;
}


/**
 * Middleware de validação para a rota de signIn.
 * Valida as propriedades de email e senha do corpo da requisição.
 */
export const signInValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        email: yup.string().required().min(5),
        senha: yup.string().required().min(6),
    })),
}));


/**
 * Endpoint que realiza a autenticação de um usuário com email e senha.
 */
export const signIn = async (req: Request<{},{}, IBodyProps>, res: Response): Promise<Response> => {

    const {email, senha} = req.body;

    // busca o usuário pelo email
    const usuario = await UsuarioProvider.getByEmail(email);

    // verifica a correspondência da senha
    const passwordMatch = await PasswordCrypto.verifyPassword(senha, usuario.senha);

    // caso a senha não corresponda
    if (!passwordMatch) {
        throw new UnauthorizedError("Email ou senha inválidos");
    } 

    if (!usuario.isValid) {
        throw new UnauthorizedError("Email não autentificado");
    }
    
    // tenta gerar o token de acesso
    const accessToken = JWTService.sign({uid: Number(usuario.id)});

    // caso tenha dado erro ao gerar token de acesso
    if (accessToken === "JWT_SECRET_NOT_FOUND") {
        throw new InternalServerError();
    }

    // se gerar o token com secesso, retorna o token de acesso
    return res.status(StatusCodes.OK).json({ accessToken });
    
};