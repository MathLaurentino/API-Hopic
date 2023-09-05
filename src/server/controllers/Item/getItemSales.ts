import { Request, Response } from "express";
import { OrderProvider } from "../../database/providers/Order";
import { validation } from "../../shared/middleware";
import * as yup from "yup";
import { StatusCodes } from "http-status-codes";

interface IQueryProps {
    created_at?: number;
}

/**
 * Validação dos parâmetros da consulta de geração de XLSX.
 */
export const getItemSalesValidation = validation((getSchema) => ({
    query: getSchema<IQueryProps>(yup.object().shape({
        created_at: yup.number().optional(), //timestamp
    })),
}));


/**
 * Gera e envia um arquivo XLSX de relatório de compras.
 */
export const getItemSales = async (req: Request<{}, {}, {}, IQueryProps>, res: Response): Promise<Response> => {
    const user_id = Number(req.headers.user_id);

    const itemSalesData = await OrderProvider.getItemSalesData(
        user_id,
        req.query.created_at || 0,
    );

    return res.status(StatusCodes.OK).json(itemSalesData);
};
