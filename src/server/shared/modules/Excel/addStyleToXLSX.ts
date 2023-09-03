import * as ExcelJS from "exceljs";

/**
 * Aplica larguras de coluna com base nos cabeçalhos fornecidos.
 * @param worksheet - A planilha ExcelJS.
 * @param headers - Os cabeçalhos das colunas.
 */
export const applyColumnWidths = (worksheet: ExcelJS.Worksheet, headers: string[]): void => {
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
export const applyCellStyles = (worksheet: ExcelJS.Worksheet): void => {
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