import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IUsuario } from "../../database/models";
import { validation } from "../../shared/middleware/Validation";
import { UsuarioProvider } from "../../database/providers/usuarios";
import * as yup from "yup";
import { ApiError, sendMail } from "../../shared/services";

interface IBodyProps extends Omit<IUsuario, "id" | "isValid" | "uniqueString"> {}

export const signUpValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        nome: yup.string().required().min(2),
        email: yup.string().required().min(5),
        senha: yup.string().required().min(6),
    })),
})); 

export const signUp = async (req: Request<{}, {}, IBodyProps>, res: Response): Promise<Response> => {

    const email = req.body.email;
    const is_new_email = await UsuarioProvider.is_new_email(email);

    if (is_new_email) { // se o email é novo
        const { nome, senha } = req.body;
        const uniqueString = randString();
        const isValid = false;

        const newUser = await UsuarioProvider.create({nome, email, senha, isValid, uniqueString});
        sendMail(email, uniqueString);
        return res.status(StatusCodes.CREATED).json(newUser); // devolve o id criado
    }
    
    else { // se o email já era cadastrado no BD
        throw new ApiError("email já cadastrado", StatusCodes.CONFLICT);
    }
};

const randString = (): string => {
    const len = 8;
    let randStr = "";
    for (let i=0; i<len; i++) {
        const ch = Math.floor((Math.random() * 10) + 1);
        randStr += ch;
    }
    return randStr;
};