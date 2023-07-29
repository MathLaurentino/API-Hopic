import { UsuarioProvider } from "../../database/providers/usuarios";
import { BadRequestError } from "../../shared/services";
import { validation } from "../../shared/middleware";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import * as yup from "yup";

interface IParamsProps {
    chave?: string,
}

export const validateEmailValidation = validation((getSchema) => ({
    params: getSchema<IParamsProps>(yup.object().shape({
        chave: yup.string().required().min(8),
    })),
}));

export const validateEmail = async (req: Request<IParamsProps>, res: Response): Promise<Response> => {

    const chave = req.params.chave;

    if (typeof chave === "undefined") {
        throw new BadRequestError("Parâmetro 'id' precisa ser informado");
    }

    await UsuarioProvider.validateEmail(chave);

    return res.status(StatusCodes.OK).send();
 
};