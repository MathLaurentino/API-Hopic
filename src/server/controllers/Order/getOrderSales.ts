import { Request, Response } from "express";
import { OrderProvider } from "../../database/providers/Order";
import { validation } from "../../shared/middleware";
import * as yup from "yup";
import { StatusCodes } from "http-status-codes";
import { myModules } from "../../shared/modules";

interface IQueryProps {
    created_at?: number;
    total_price?: number;
}


/**
 * Validação dos parâmetros da consulta.
 */
export const getOrderSalesValidation = validation((getSchema) => ({
    query: getSchema<IQueryProps>(
        yup.object().shape({
            created_at: yup.number().optional(), //timestamp
            total_price: yup.number().optional().moreThan(0),
        })
    ),
}));


/**
 * Envia dados de relatorio de vendas no formato JSON.
 */
export const getOrderSales = async ( req: Request<{}, {}, {}, IQueryProps>, res: Response ): Promise<Response> => {

    const user_id = Number(req.headers.user_id);

    const orderSalesData = await OrderProvider.getOrderSalesData(
        user_id,
        req.query.created_at || 0,
        req.query.total_price || 0
    );

    return res.status(StatusCodes.OK).json(orderSalesData);
};


/**
 * Envia dados de relatorio de vendas no formato XLSX.
 */
export const getOrderSalesXSLX = async ( req: Request<{}, {}, {}, IQueryProps>, res: Response ): Promise<void> => {

    const user_id = Number(req.headers.user_id);

    const orderSalesData = await OrderProvider.getOrderSalesData(
        user_id,
        req.query.created_at || 0,
        req.query.total_price || 0
    );

    // return res.status(StatusCodes.OK).json(orderSalesData);
    const xlsxFilePath = await myModules.createOrderSalesXLSX(orderSalesData);

    res.setHeader( "Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" );
    res.setHeader( "Content-Disposition", "attachment; filename=relatorio_vendas.xlsx" );

    return res.sendFile(xlsxFilePath);
};