import { XLSXData } from "../../../database/models";
import * as ExcelJS from "exceljs";
import * as path from "path";


/**
 * Cria um arquivo XLSX com os dados fornecidos.
 * @param data - Os dados para preencher o arquivo XLSX.
 * @returns O caminho do arquivo XLSX criado.
 */
export const createXLSXfile = async (data: XLSXData[]): Promise<string> => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Minha Planilha");

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

    const lestRow = ["-", "-", "-", "-", "-", "-", "-", "-", "R$ "+allTotalPriceOrders.toFixed(2)];
    worksheet.addRow(lestRow);

    applyColumnWidths(worksheet, headers);
    applyCellStyles(worksheet);

    const xlsxFilePath = path.join(__dirname, "..", "..", "..", "..", "..", "uploads", "files", "relatorio_compras.xlsx");
    await workbook.xlsx.writeFile(xlsxFilePath);

    return xlsxFilePath;
};



/**
 * Cria um array de arrays contendo os dados para preencher o arquivo XLSX.
 * @param data - Os dados a serem formatados.
 * @returns O array de arrays formatado para preencher o arquivo XLSX.
 */
const createDataForExcel = (data: XLSXData[]): [(string | number)[][], number] => {
    const dataExcel: (string | number)[][] = [];
    let allTotalPriceOrders: number = 0;
    data.forEach((element, index, array) => {
        const [date, time] = formatDataTime(Number(element.created_at));

        element.order_items.forEach(item => {
            const row = [
                element.order_id, date, time, item.item_name, 
                item.quantity, "R$ "+item.item_price_at_time.toFixed(2), 
                "R$ "+(item.quantity * item.item_price_at_time).toFixed(2), 
                "R$ "+element.total_price.toFixed(2), "-"
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
                cell.alignment = { horizontal: "center" };
            } else {
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: isEvenRow ? "FFFFFF" : "ECECEC" },
                };
                cell.alignment = { horizontal: "center" };
            }
        });
    });
};


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