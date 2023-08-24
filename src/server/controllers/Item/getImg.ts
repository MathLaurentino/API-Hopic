import { Request, Response } from "express";
import { validation } from "../../shared/middleware/Validation";
import { ItemProvider } from "../../database/providers/Item";
import { ApiError, BadRequestError, UnauthorizedError } from "../../shared/services/ApiErrors";
import { StatusCodes } from "http-status-codes";
import * as path from "path";
import * as yup from "yup";
import fs from "fs";


interface IParamProps {
    imageAddress?: string;
}


/**
 * Middleware de validação para os parâmetros da requisição.
 * Valida se 'imageAddress' foi enviado como parâmetro na URL
 */
export const getImgValidation = validation((getSchema) => ({
    params: getSchema<IParamProps>(yup.object().shape({
        imageAddress: yup.string().required(),
    })),
})); 


/**
 * Endpoint para obter uma imagem
 */
export const getImg = async (req: Request<IParamProps>, res: Response): Promise<void> => {

    if (!req.params.imageAddress) {
        throw new BadRequestError("Parametro 'imageAdress' é obrigatorio");
    }

    const user_id = Number(req.headers.user_id);
    const imageAddress = req.params.imageAddress;

    // Verifica se o cliente tem direito ao acesso à imagem
    const isClientAuthorized = await ItemProvider.validateImgClientAccess(imageAddress, user_id);
    if (!isClientAuthorized) {
        throw new UnauthorizedError("O acesso à imagem não é autorizado para este usuário");
    }

    const caminhoParaImagem = path.join(__dirname, "..", "..", "..", "..", "uploads", "imgs", imageAddress);

    if (fs.existsSync(caminhoParaImagem)) {
        res.sendFile(caminhoParaImagem);
    } 
    else {
        throw new ApiError("Imagem não encontrada", StatusCodes.NOT_FOUND);
    }
    
};