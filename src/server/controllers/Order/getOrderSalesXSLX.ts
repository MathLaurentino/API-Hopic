import { Request, Response } from "express";
import { OrderProvider } from "../../database/providers/Order";
import { validation } from "../../shared/middleware";
import  { myModules } from "../../shared/modules";
import * as yup from "yup";

interface IQueryProps {
    created_at?: number;
    total_price?: number;
}

/**
 * Validação dos parâmetros da consulta de geração de XLSX.
 */
export const getOrderSalesXSLXValidation = validation((getSchema) => ({
    query: getSchema<IQueryProps>(yup.object().shape({
        created_at: yup.number().optional(), //timestamp
        total_price: yup.number().optional().moreThan(0),
    })),
}));



/**
 * Gera e envia um arquivo XLSX de relatório de compras.
 */
export const getOrderSalesXSLX = async (req: Request<{}, {}, {}, IQueryProps>, res: Response): Promise<void> => {
    const user_id = Number(req.headers.user_id);

    const orderSalesData = await OrderProvider.getOrderSalesData(
        user_id,
        req.query.created_at || 0,
        req.query.total_price || 0
    );

    const xlsxFilePath = await myModules.createOrderSalesXLSX(orderSalesData);

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=relatorio_vendas.xlsx");

    return res.sendFile(xlsxFilePath);
};
