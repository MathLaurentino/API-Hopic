import * as create from "./create";
import * as getAll from "./getAll";
import * as getItemSales from "./getItemSales";
import * as getOrderSales from "./getOrderSales";

export const OrderController = {
    ...create,
    ...getAll,
    ...getItemSales,
    ...getOrderSales,
};