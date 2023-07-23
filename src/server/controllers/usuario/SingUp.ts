import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IUsuario } from "../../database/models";
import { validation } from "../../shared/middleware/Validation";
import { UsuarioProvider } from "../../database/providers/usuarios";
import * as yup from "yup";
import { ApiError } from "../../shared/services";

interface IBodyProps extends Omit<IUsuario, "id"> {}

export const signUpValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        nome: yup.string().required().min(2),
        email: yup.string().required().min(5),
        senha: yup.string().required().min(6),
    })),
})); 

export const signUp = async (req: Request<{}, {}, IBodyProps>, res: Response): Promise<Response> => {

    const is_new_email = await UsuarioProvider.is_new_email(req.body.email);

    if (is_new_email) { // se o email é novo
        const newUser = await UsuarioProvider.create(req.body);
        return res.status(StatusCodes.CREATED).json(newUser); // devolve o id criado
    }
    else { // se o email já era cadastrado no BD
        throw new ApiError("email já cadastrado", StatusCodes.CONFLICT);
    }
  
};