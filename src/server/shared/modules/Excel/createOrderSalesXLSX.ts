import { applyColumnWidths, applyCellStyles } from "./addStyleToXLSX";
import { ISalesData } from "../../../database/models";
import * as ExcelJS from "exceljs";
import * as path from "path";


/**
 * Cria um arquivo XLSX com dados de vendas.
 * @param {ISalesData[]} orderSalesData - Os dados de vendas a serem incluídos no arquivo.
 * @returns {Promise<string>} O caminho do arquivo XLSX gerado.
 */
export const createOrderSalesXLSX = async (orderSalesData: ISalesData[]): Promise<string> => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Minha Planilha");

    const headers = createOrderSalesTable(worksheet, orderSalesData);

    applyColumnWidths(worksheet, headers);
    applyCellStyles(worksheet);

    const xlsxFilePath = path.join(__dirname, "..", "..", "..", "..", "..", "uploads", "files", "relatorio_vendas.xlsx");
    await workbook.xlsx.writeFile(xlsxFilePath);

    return xlsxFilePath;
};


/**
 * Cria a tabela de relatorio_vendas na planilha.
 * @param {ExcelJS.Worksheet} worksheet - A planilha na qual a tabela será criada.
 * @param {ISalesData[]} data - Os dados de vendas a serem incluídos na tabela.
 * @returns {string[]} Os nomes das colunas da tabela.
 */
const createOrderSalesTable = (worksheet: ExcelJS.Worksheet, data: ISalesData[]): string[] => {
    const headers = [
        "Id Pedido",
        "Data",
        "Hora",
        "Itens",
        "Quantidade",
        "Preço unid. Item",
        "Preço Total item",
        "Valor Total Pedido",
        "Valor Total Vendas"
    ];
    worksheet.addRow(headers);

    const [dataExcel, allTotalPriceOrders] = createDataForExcel(data);

    dataExcel.forEach(rowData => {
        worksheet.addRow(rowData);
    });

    const lestRow = ["-", "-", "-", "-", "-", "-", "-", "-", "R$ "+ Number(allTotalPriceOrders).toFixed(2)];
    worksheet.addRow(lestRow);

    return headers;
};


/**
 * Cria dados para a planilha com base nos dados de vendas.
 * @param {ISalesData[]} data - Os dados de vendas a serem incluídos na planilha.
 * @returns Um array contendo os dados formatados para a planilha e o valor total das vendas.
 */
const createDataForExcel = (data: ISalesData[]): [(string | number)[][], number] => {
    const dataExcel: (string | number)[][] = [];
    let allTotalPriceOrders: number = 0;
    data.forEach((element, index, array) => {
        const [date, time] = formatDataTime(Number(element.created_at));

        element.order_items.forEach(item => {
            const row = [
                element.order_id, date, time, item.item_name, 
                item.quantity, "R$ "+ Number(item.item_price_at_time).toFixed(2), 
                "R$ "+ Number(item.quantity * item.item_price_at_time).toFixed(2), 
                "R$ "+ Number(element.total_price).toFixed(2), "-"
            ];
            dataExcel.push(row);
        });

        if (index !== array.length - 1) {
            const row = ["-", "-", "-", "-", "-", "-", "-", "-", "-"];
            dataExcel.push(row);
        }

        allTotalPriceOrders += element.total_price;
    });

    return [dataExcel, allTotalPriceOrders];
};


/**
 * Formata um carimbo de data e hora a partir de um carimbo de data UNIX.
 * @param {number} timestamp - O carimbo de data UNIX a ser formatado.
 * @returns {[string, string]} Um array contendo a data e a hora formatadas.
 */
const formatDataTime = (timestemp: number): [string, string] => {
    const dateTime = new Date(timestemp);

    const day = String(dateTime.getDate()).padStart(2, "0");
    const month = String(dateTime.getMonth() + 1).padStart(2, "0");
    const year = dateTime.getFullYear();
    const date = day + "/" + month + "/" + year;

    const hour = String(dateTime.getHours()).padStart(2, "0");
    const minute = String(dateTime.getMinutes()).padStart(2, "0");
    const time = hour + ":" + minute;

    return [date, time];
};