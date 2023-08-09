import { UsuarioProvider } from "../../database/providers/usuarios";
import { BadRequestError, PasswordCrypto, UnauthorizedError } from "../../shared/services";
import { validation } from "../../shared/middleware";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import * as yup from "yup";

interface IParamProps {
    chave?: string,
}

interface IBodyProps {
    email: string,
    senha: string
}

/**
 * Valida o campo email, senha e chave
 */
export const newPasswordValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        email: yup.string().required().min(2),
        senha: yup.string().required().min(2),
    })),
    params: getSchema<IParamProps>(yup.object().shape({
        chave: yup.string().required(),
    })),
}));

/**
 * Verifica se a chave de alteração de senha é valida para o email fornecido.
 * Se sim, altera a senha do usuário
 */
export const newPasswordRequest = async (req: Request<IParamProps, {}, IBodyProps>, res: Response): Promise<Response> => {

    const chave = req.params.chave;
    const {email, senha} = req.body;

    if (typeof chave === "undefined") {
        throw new BadRequestError("Parâmetro 'chave' precisa ser informado");
    } 

    const user_data  = await UsuarioProvider.getByEmail(email);

    if (user_data.uniqueStringPassword != chave) {
        throw new UnauthorizedError("Chave de alteração de senha inválida");
    }

    const userNewhashedPassword = await PasswordCrypto.hashPassword(senha);
    user_data.senha = userNewhashedPassword;
    user_data.uniqueStringPassword = null;

    UsuarioProvider.updateById(user_data.id, user_data);

    return res.status(StatusCodes.OK).send();
 
};