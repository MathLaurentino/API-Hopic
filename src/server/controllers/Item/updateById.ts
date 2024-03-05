import * as yup from "yup";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IItem } from "../../database/models";
import { validation } from "../../shared/middleware/Validation";
import { removeImageFromFileSystem, validateItemUniqueness } from "../../shared/services";
import { ItemProvider } from "../../database/providers/Item";
import { UnauthorizedError } from "../../shared/services/ApiErrors";

interface IParamProps {
    id?: number;
}

interface IBodyProps extends Omit<IItem, "id" | "user_id" | "imageAddress"> {}

export const updateByIdValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        name: yup.string().required().min(2).max(100),
        price: yup.number().required().moreThan(0),
        color: yup.string().required().min(6).max(6),
        shortCut: yup.string().required().min(1).max(30),
    })),
    params: getSchema<IParamProps>(yup.object().shape({
        id: yup.number().integer().required().moreThan(0),
    })),
})); 


export const updateById = async (req: Request<IParamProps, {}, IBodyProps>, res: Response): Promise<Response> => {

    const { name, price, color, shortCut } = req.body;
    const produtoId = Number(req.params.id);
    const user_id = Number(req.headers.user_id); 
    let imageAddress:string | null = null;
    if (req.file) {
        imageAddress = req.file.filename;
    }

    const isClientAuthorized = await  ItemProvider.validateClientAccess(produtoId, user_id);
    if (!isClientAuthorized) {
        throw new UnauthorizedError("Alteração negada");
    }

    const items: IItem[] = await ItemProvider.getAll(user_id);
    const errors = validateItemUniqueness(items, name, shortCut);
    if (errors != null) {
        return res.status(StatusCodes.CONFLICT).json(errors); 
    }
    
    const userProduto = await ItemProvider.getbyId(produtoId);
    if (userProduto.imageAddress) { // se o produto tem uma img no sistema, ele é apagado
        removeImageFromFileSystem(userProduto.imageAddress);
    }

    await ItemProvider.updateById(produtoId, { 
        name, 
        price, 
        color, 
        shortCut, 
        imageAddress 
    });
    
    return res.status(StatusCodes.NO_CONTENT).send();
};