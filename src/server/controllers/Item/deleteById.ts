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

    const itemId = req.params.id;
    const userId = Number(req.headers.user_id);

    if (typeof itemId  === "undefined") {
        throw new BadRequestError("Parâmetro 'id' precisa ser informado");
    }

    const isClientAuthorized = await  ItemProvider.validateClientAccess(itemId, userId);

    if (!isClientAuthorized) {
        throw new UnauthorizedError("Alteração negada");
    }

    const itemVisibility: boolean = await ItemProvider.checkForeignKeyRelation(itemId);

    /**Se o item já tiver relação com algum elemento da tabela orderItem, 
     * apenas é mudada a visibilidade para false */
    if (itemVisibility) {

        await ItemProvider.updateById(itemId, {visibility: false});
        return res.status(StatusCodes.OK).send();
        
    } else {
        
        const userProduto = await ItemProvider.getbyId(itemId);
        await ItemProvider.deleteById(itemId);

        // se o produto tem uma img no sistema, ele é apagado
        if (userProduto.imageAddress) { 
            removeImageFromFileSystem(userProduto.imageAddress);
        }
        
        return res.status(StatusCodes.OK).send();

    }
};