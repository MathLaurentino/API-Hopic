import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { OrderProvider } from "../../database/providers/Order";
import { validation } from "../../shared/middleware";
import * as yup from "yup";

interface IQueryProps {
    created_at?: Date;
    total_price?: number;
}

export const getCSVValidation = validation((getSchema) => ({
    query: getSchema<IQueryProps>(yup.object().shape({
        created_at: yup.date().optional(),
        total_price: yup.number().optional().moreThan(0),
    })), 
}));

export const getCSV = async (req: Request<{}, {}, {}, IQueryProps>, res: Response): Promise<Response> => {

    const user_id = Number(req.headers.user_id);

    // Chama o provider (provedor) para buscar todos os pedidos com base nos parâmetros passados na query.
    // Se os parâmetros não forem fornecidos, usa-se valores padrão: página 1, limite 7, data mínima e preço total 0.
    const result = await OrderProvider.getCSV(
        user_id, 
        req.query.created_at ? new Date(req.query.created_at) : new Date(0), 
        req.query.total_price || 0
    );

    return res.status(StatusCodes.OK).json(result);
};
