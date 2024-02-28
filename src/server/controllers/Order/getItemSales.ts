import { Request, Response } from "express";
import { OrderProvider } from "../../database/providers/Order";
import { validation } from "../../shared/middleware";
import * as yup from "yup";
import { StatusCodes } from "http-status-codes";
import { myModules } from "../../shared/modules";

interface IQueryProps {
    created_at?: number;
}

/**
 * Validação dos parâmetros da consulta.
 * @middleware
 */
export const getItemSalesValidation = validation((getSchema) => ({
    query: getSchema<IQueryProps>(
        yup.object().shape({
            created_at: yup.number().optional(), //timestamp
        })
    ),
}));


/**
 * Envia dados de quantidade de vendas dos produtos no formato JSON.
 */
export const getItemSales = async ( req: Request<{}, {}, {}, IQueryProps>, res: Response ): Promise<Response> => {
    const user_id = Number(req.headers.user_id);

    const data = await OrderProvider.getItemSalesData(
        user_id,
        req.query.created_at || 0
    );

    return res.status(StatusCodes.OK).json(data);
};


/**
 * Envia dados de quantidade de vendas dos produtos no formato XLSX.
 */
export const getItemSalesXLSX = async ( req: Request<{}, {}, {}, IQueryProps>, res: Response ): Promise<void> => {
    const user_id = Number(req.headers.user_id);

    const data = await OrderProvider.getItemSalesData(
        user_id,
        req.query.created_at || 0
    );

    const xlsxFilePath = await myModules.createItemSalesXLSX(data);

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=relatorio_produtos.xlsx");

    return res.sendFile(xlsxFilePath);
};