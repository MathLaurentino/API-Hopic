import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IItem } from "../../database/models";
import { validation } from "../../shared/middleware/Validation";
import { ItemProvider } from "../../database/providers/Item";
import * as yup from "yup";
import { ApiError } from "../../shared/services";

interface IBodyProps extends Omit<IItem, "id" | "user_id" | "imageAddress"> {}

export const createValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        name: yup.string().required().min(2).max(100),
        price: yup.number().required().moreThan(0),
        color: yup.string().required().min(6).max(6),
        shortCut: yup.string().required().min(1).max(30),
    })),
})); 

export const create = async (req: Request<{}, {}, IBodyProps>, res: Response): Promise<Response> => {

    const { name, price, color, shortCut } = req.body;
    const user_id = Number(req.headers.user_id); 

    let imageAddress:string | null = null;
    if (req.file) {
        imageAddress = req.file.filename;
    }

    const itens: IItem[] = await ItemProvider.getAll(user_id);

    itens.forEach(item => {
        if (item.name.toUpperCase() == name.toUpperCase()) {
            throw new ApiError("Nome de item já em uso", 409);
        }
        if (item.shortCut.toUpperCase() == shortCut.toUpperCase()) {
            throw new ApiError("ShortCut de item já em uso", 409);
        }
    });

    const result = await ItemProvider.create({
        name,
        price,
        user_id,
        color,
        shortCut,
        imageAddress,
    });

    return res.status(StatusCodes.CREATED).json(result); // devolve o id criado
};