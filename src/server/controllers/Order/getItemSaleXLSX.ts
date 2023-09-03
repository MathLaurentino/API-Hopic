import { Request, Response } from "express";
import { OrderProvider } from "../../database/providers/Order";
import { validation } from "../../shared/middleware";
import  { myModules } from "../../shared/modules";
import * as yup from "yup";

interface IQueryProps {
    created_at?: number;
}

/**
 * Validação dos parâmetros da consulta de geração de XLSX.
 * @middleware
 */
export const getItemSaleXLSXValidation = validation((getSchema) => ({
    query: getSchema<IQueryProps>(yup.object().shape({
        created_at: yup.number().optional(), //timestamp
    })),
}));


/**
 * Gera e envia um arquivo XLSX de relatório de produtos.
 */
export const getItemSaleXLSX = async (req: Request<{}, {}, {}, IQueryProps>, res: Response): Promise<void> => {
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
