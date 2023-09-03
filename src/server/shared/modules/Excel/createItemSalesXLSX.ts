import { applyColumnWidths, applyCellStyles } from "./addStyleToXLSX";
import * as ExcelJS from "exceljs";
import * as path from "path";


export interface ItemSalesData {
    id: number,
    name: string,
    item_price_at_time: number,
    quantity: number,
}


/**
 * Cria um arquivo XLSX com dados de vendas de produtos.
 * @param {ItemSalesData[]} orderSalesData - Os dados de vendas de produtos a serem incluídos no arquivo.
 * @returns {Promise<string>} O caminho do arquivo XLSX gerado.
 */
export const createItemSalesXLSX = async (orderSalesData: ItemSalesData[]): Promise<string> => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Minha Planilha");

    const headers = createItemSalesTable(worksheet, orderSalesData);

    applyColumnWidths(worksheet, headers);
    applyCellStyles(worksheet);

    const xlsxFilePath = path.join(__dirname, "..", "..", "..", "..", "..", "uploads", "files", "relatorio_produtos.xlsx");
    await workbook.xlsx.writeFile(xlsxFilePath);

    return xlsxFilePath;
};


/**
 * Cria a tabela de vendas de produtos na planilha.
 * @param {ExcelJS.Worksheet} worksheet - A planilha na qual a tabela será criada.
 * @param {ItemSalesData[]} data - Os dados de vendas de produtos a serem incluídos na tabela.
 * @returns {string[]} Os nomes das colunas da tabela.
 */
const createItemSalesTable = (worksheet: ExcelJS.Worksheet, data: ItemSalesData[]): string[] => {
    const headers = [
        "Id Produto",
        "Produto",
        "Quantidade",
        "Preço unid. Item",
        "Total Vendas"
    ];
    worksheet.addRow(headers);

    const dataExcel = createDataForExcel(data);
    dataExcel.forEach(rowData => {
        worksheet.addRow(rowData);
    });

    return headers;
};


/**
 * Cria dados para a planilha com base nos dados de vendas de produtos.
 * @param {ItemSalesData[]} data - Os dados de vendas de produtos a serem incluídos na planilha.
 * @returns Um array contendo os dados formatados para a planilha.
 */
const createDataForExcel = (data: ItemSalesData[]): (string | number)[][] => {
    const dataExcel: (string | number)[][] = [];
    data.forEach((item) => {

        const row = [
            item.id,
            item.name,
            item.quantity,
            "R$ " + Number(item.item_price_at_time).toFixed(2),
            "R$ " + Number(item.item_price_at_time * item.quantity).toFixed(2)
        ];
        dataExcel.push(row);

    });

    return dataExcel;
};