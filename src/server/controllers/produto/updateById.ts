import * as yup from "yup";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IProduto } from "../../database/models";
import { validation } from "../../shared/middleware/Validation";
import { removeImageFromFileSystem } from "../../shared/services";
import { ProdutoProvider } from "../../database/providers/produtos";
import { UnauthorizedError } from "../../shared/services/ApiErrors";

interface IParamProps {
    id?: number;
}

interface IBodyProps extends Omit<IProduto, "id" | "user_id" | "imageAddress"> {}

export const updateByIdValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        name: yup.string().required().min(2),
        price: yup.number().required().moreThan(0),
    })),
    params: getSchema<IParamProps>(yup.object().shape({
        id: yup.number().integer().required().moreThan(0),
    })),
})); 


export const updateById = async (req: Request<IParamProps, {}, IBodyProps>, res: Response): Promise<Response> => {

    const { name, price } = req.body;
    const produtoId = Number(req.params.id);
    const user_id = Number(req.headers.user_id); 

    let imageAddress:string | null = null;
    if (req.file) {
        imageAddress = req.file.filename;
    }

    const isClientAuthorized = await  ProdutoProvider.validateClientAccess(produtoId, user_id);

    if (isClientAuthorized) {

        const userProduto = await ProdutoProvider.getbyId(produtoId);
        if (userProduto.imageAddress) { // se o produto tem uma img no sistema, ele é apagado
            removeImageFromFileSystem(userProduto.imageAddress);
        }

        await ProdutoProvider.updateById(produtoId, { name, price, imageAddress });
        return res.status(StatusCodes.NO_CONTENT).send();

    }

    throw new UnauthorizedError("Alteração negada");

};