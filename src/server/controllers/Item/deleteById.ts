import * as yup from "yup";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { validation } from "../../shared/middleware/Validation";
import { removeImageFromFileSystem } from "../../shared/services";
import { ItemProvider } from "../../database/providers/Item";
import { BadRequestError, UnauthorizedError } from "../../shared/services/ApiErrors";

interface IParamsProps {
    id?: number;
}

export const deleteByIdValidation = validation((getSchema) => ({
    params: getSchema<IParamsProps>(yup.object().shape({
        id: yup.number().integer().required().moreThan(0),
    })),
})); 

export const deleteById = async (req: Request<IParamsProps>, res: Response): Promise<Response> => {

    const produtoId = req.params.id;
    const userId = Number(req.headers.user_id);

    if (typeof produtoId  === "undefined") {
        throw new BadRequestError("Parâmetro 'id' precisa ser informado");
    }

    const isClientAuthorized = await  ItemProvider.validateClientAccess(produtoId, userId);

    if (isClientAuthorized) {
        const userProduto = await ItemProvider.getbyId(produtoId);

        // se o produto tem uma img no sistema, ele é apagado
        if (userProduto.imageAddress) { 
            removeImageFromFileSystem(userProduto.imageAddress);
        }

        await ItemProvider.deleteById(produtoId);
        return res.status(StatusCodes.OK).send();
    }

    throw new UnauthorizedError("Alteração negada");

};