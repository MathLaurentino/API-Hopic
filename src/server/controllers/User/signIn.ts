import { Request, Response } from "express";
import { validation } from "../../shared/middleware";
import * as yup from "yup";
import { UserProvider } from "../../database/providers/User";
import { StatusCodes } from "http-status-codes";
import { InternalServerError, JWTService, PasswordCrypto, UnauthorizedError } from "../../shared/services";


/**
 * Propriedades da requisição do endpoint de signIn.
 * Contém as propriedades do corpo da requisição
 */
interface IBodyProps {
    email: string;
    password:string;
}


/**
 * Middleware de validação para a rota de signIn.
 * Valida as propriedades de email e password do corpo da requisição.
 */
export const signInValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        email: yup.string().required().min(5),
        password: yup.string().required().min(6),
    })),
}));


/**
 * Endpoint que realiza a autenticação de um usuário com email e password.
 */
export const signIn = async (req: Request<{},{}, IBodyProps>, res: Response): Promise<Response> => {

    const {email, password} = req.body;

    // busca o usuário pelo email
    const user = await UserProvider.getByEmail(email);

    // verifica a correspondência da password
    const passwordMatch = await PasswordCrypto.verifyPassword(password, user.password);

    // caso a password não corresponda
    if (!passwordMatch) {
        throw new UnauthorizedError("Email ou password inválidos");
    } 

    if (!user.isValid) {
        throw new UnauthorizedError("Email não autentificado");
    }
    
    // tenta gerar o token de acesso
    const accessToken = JWTService.sign({uid: Number(user.id)});

    // caso tenha dado erro ao gerar token de acesso
    if (accessToken === "JWT_SECRET_NOT_FOUND") {
        throw new InternalServerError();
    }

    // se gerar o token com secesso, retorna o token de acesso
    return res.status(StatusCodes.OK).json({ accessToken });
    
};