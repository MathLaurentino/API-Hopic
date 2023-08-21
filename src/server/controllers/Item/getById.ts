import * as yup from "yup";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { validation } from "../../shared/middleware/Validation";
import { ItemProvider } from "../../database/providers/Item";
import { BadRequestError, UnauthorizedError } from "../../shared/services/ApiErrors";

interface IParamsProps {
    id?: number;
}

export const getByIdValidation = validation((getSchema) => ({
    params: getSchema<IParamsProps>(yup.object().shape({
        id: yup.number().integer().required().moreThan(0),
    })),
})); 

export const getById = async (req: Request<IParamsProps>, res: Response): Promise<Response> => {

    const userId = Number(req.headers.user_id);
    const predutoId = req.params.id;

    if (typeof predutoId  === "undefined") {
        throw new BadRequestError("Parâmetro id necessário"); 
    }

    const isClientAuthorized = await ItemProvider.validateClientAccess(predutoId, userId);

    if (isClientAuthorized) {
        const result = await ItemProvider.getbyId(predutoId);
        return res.status(StatusCodes.OK).json(result);
    } 
        
    throw new UnauthorizedError("Acesso negado");

};