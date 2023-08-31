import { Request, Response } from "express";
import { OrderProvider } from "../../database/providers/Order";
import { validation } from "../../shared/middleware";
import { XLSXData } from "../../database/models";
import * as ExcelJS from "exceljs";
import * as yup from "yup";
import * as path from "path";

interface IQueryProps {
    created_at?: number;
    total_price?: number;
}

/**
 * Validação dos parâmetros da consulta de geração de XLSX.
 * @middleware
 */
export const getXLSXValidation = validation((getSchema) => ({
    query: getSchema<IQueryProps>(yup.object().shape({
        created_at: yup.number().optional(), //timestamp
        total_price: yup.number().optional().moreThan(0),
    })),
}));



/**
 * Gera e envia um arquivo XLSX de relatório de compras.
 */
export const getXLSX = async (req: Request<{}, {}, {}, IQueryProps>, res: Response): Promise<void> => {
    const user_id = Number(req.headers.user_id);

    const data = await OrderProvider.getXLSX(
        user_id,
        req.query.created_at || 0,
        req.query.total_price || 0
    );

    const xlsxFilePath = await createXLSXfile(data);

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=relatorio_compras.xlsx");

    return res.sendFile(xlsxFilePath);
};



/**
 * Cria um arquivo XLSX com os dados fornecidos.
 * @param data - Os dados para preencher o arquivo XLSX.
 * @returns O caminho do arquivo XLSX criado.
 */
const createXLSXfile = async (data: XLSXData[]): Promise<string> => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Minha Planilha");

    const headers = [
        "Id Pedido",
        "Itens",
        "Data",
        "Hora",
        "Quantidade",
        "Preço unid. Item",
        "Preço Total item",
        "Valor Total Pedido"
    ];
    worksheet.addRow(headers);

    const dataExcel = createDataForExcel(data);

    dataExcel.forEach(rowData => {
        worksheet.addRow(rowData);
    });

    applyColumnWidths(worksheet, headers);
    applyCellStyles(worksheet);

    const xlsxFilePath = path.join(__dirname, "..", "..", "..", "..", "uploads", "files", "relatorio_compras.xlsx");
    await workbook.xlsx.writeFile(xlsxFilePath);

    return xlsxFilePath;
};



/**
 * Cria um array de arrays contendo os dados para preencher o arquivo XLSX.
 * @param data - Os dados a serem formatados.
 * @returns O array de arrays formatado para preencher o arquivo XLSX.
 */
const createDataForExcel = (data: XLSXData[]): (string | number)[][] => {
    const dataExcel: (string | number)[][] = [];

    data.forEach(element => {
        const dateTime = new Date(element.created_at);
        const date = dateTime.getDate() + "/" + (dateTime.getMonth() + 1) + "/" + dateTime.getFullYear();
        const time = dateTime.getHours() + ":" + dateTime.getMinutes();

        element.order_items.forEach(item => {
            const row = [element.order_id, item.item_name, date, time, item.quantity, item.item_price_at_time, item.quantity * item.item_price_at_time, element.total_price];
            dataExcel.push(row);
        });
    });

    return dataExcel;
};



/**
 * Aplica larguras de coluna com base nos cabeçalhos fornecidos.
 * @param worksheet - A planilha ExcelJS.
 * @param headers - Os cabeçalhos das colunas.
 */
const applyColumnWidths = (worksheet: ExcelJS.Worksheet, headers: string[]): void => {
    worksheet.columns.forEach((column, columnIndex) => {
        let maxLength = headers[columnIndex].length;

        worksheet.getColumn(columnIndex + 1).eachCell({ includeEmpty: true }, (cell: ExcelJS.Cell) => {
            const columnLength = cell.value ? cell.value.toString().length : 10;
            if (columnLength > maxLength) {
                maxLength = columnLength;
            }
        });

        column.width = maxLength < 10 ? 10 : maxLength;
    });
};


/**
 * Aplica estilos de célula à planilha.
 * @param worksheet - A planilha ExcelJS.
 */
const applyCellStyles = (worksheet: ExcelJS.Worksheet): void => {
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        const isHeaderRow = rowNumber === 1;
        const isEvenRow = rowNumber % 2 === 0;

        row.eachCell((cell) => {
            if (isHeaderRow) {
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFCCCCCC" },
                };
                cell.font = {
                    bold: true,
                };
            } else {
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: isEvenRow ? "FFFFFF" : "ECECEC" },
                };
            }
        });
    });
};