import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IProduto } from "../../database/models";
import { validation } from "../../shared/middleware/Validation";
import { ProdutoProvider } from "../../database/providers/produtos";
import * as yup from "yup";

interface IBodyProps extends Omit<IProduto, "id" | "user_id" | "imageAddress"> {}

export const createValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        name: yup.string().required().min(2),
        price: yup.number().integer().required().moreThan(0),
    })),
})); 

export const create = async (req: Request<{}, {}, IBodyProps>, res: Response): Promise<Response> => {

    const { name, price } = req.body;
    const user_id = Number(req.headers.idUsuario); 

    let imageAddress:string | null = null;
    if (req.file) {
        imageAddress = req.file.filename;
    }

    const result = await ProdutoProvider.create({
        name: name, 
        price: price,
        user_id: user_id,
        imageAddress: imageAddress,
    });

    return res.status(StatusCodes.CREATED).json(result); // devolve o id criado
    
};