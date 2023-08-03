import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { OrderProvider } from "../../database/providers/Order";
import { validation } from "../../shared/middleware";
import * as yup from "yup";
import { UnauthorizedError } from "../../shared/services";

interface IQueryProps {
    page?: number;
    limit?: number;
    id?: number;
    created_at?: Date;
    total_price?: number;
}

export const getAllValidation = validation((getSchema) => ({
    query: getSchema<IQueryProps>(yup.object().shape({
        page: yup.number().optional().moreThan(0),
        limit: yup.number().optional().moreThan(0),
        id: yup.number().integer().optional().default(0),
        created_at: yup.date().optional(),
        total_price: yup.number().optional().moreThan(0),
    })), 
}));

export const getAll = async (req: Request<{}, {}, {}, IQueryProps>, res: Response): Promise<Response> => {

    const user_id = Number(req.headers.user_id);

    if (req.query.id !== undefined){
        const order_id = Number(req.query.id);
        const clienteAccess = await OrderProvider.validateClientAccess(order_id, user_id);
        if (!clienteAccess)
            throw new UnauthorizedError("Id invalido para esse usuario");
    }
        
    // Chama o provider (provedor) para buscar todos os pedidos com base nos parâmetros passados na query.
    // Se os parâmetros não forem fornecidos, usa-se valores padrão: página 1, limite 7, data mínima e preço total 0.
    const result = await OrderProvider.getAll(
        user_id, 
        req.query.page || 1, 
        req.query.limit || 7, 
        Number(req.query.id || 0),
        req.query.created_at ? new Date(req.query.created_at) : new Date(0), 
        req.query.total_price || 0
    );

    return res.status(StatusCodes.OK).json(result);
};
