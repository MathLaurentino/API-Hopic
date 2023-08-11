import { Request, Response } from "express";
// import { StatusCodes } from "http-status-codes";
import { OrderProvider } from "../../database/providers/Order";
import { validation } from "../../shared/middleware";
import { createObjectCsvWriter } from "csv-writer";
import * as yup from "yup";
import * as path from "path";

interface IQueryProps {
    created_at?: Date;
    total_price?: number;
}

export const getCSVValidation = validation((getSchema) => ({
    query: getSchema<IQueryProps>(yup.object().shape({
        created_at: yup.date().optional(),
        total_price: yup.number().optional().moreThan(0),
    })), 
}));

export const getCSV = async (req: Request<{}, {}, {}, IQueryProps>, res: Response): Promise<void> => {
    const user_id = Number(req.headers.user_id);

    const data = await OrderProvider.getCSV(
        user_id,
        req.query.created_at ? new Date(req.query.created_at) : new Date(0),
        req.query.total_price || 0
    );

    const csvFilePath = path.join(__dirname, "relatorio_compras.csv");

    res.setHeader("Content-Disposition", "attachment; filename=relatorio_compras.csv");
    res.setHeader("Content-Type", "text/csv");

    const csvWriter = createObjectCsvWriter({
        path: csvFilePath,
        header: [
            { id: "order_id", title: "Order ID" },
            { id: "total_price", title: "Total Price" },
            { id: "created_at", title: "Created At" },
            { id: "order_items", title: "Order Items" },
        ],
    });

    const records = data.map(order => {
        const orderItemsText = order.order_items.map(item => `${item.quantity} ${item.name}`).join(", ");
        return {
            order_id: order.order_id,
            total_price: order.total_price,
            created_at: order.created_at,
            order_items: orderItemsText,
        };
    });

    await csvWriter.writeRecords(records);

    return res.sendFile(csvFilePath);
};
