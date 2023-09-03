import * as create from "./create";
import * as getAll from "./getAll";
import * as getOrderSalesXSLX from "./getOrderSalesXSLX";
import * as getItemSaleXLSX from "./getItemSaleXLSX";

export const OrderController = {
    ...create,
    ...getAll,
    ...getOrderSalesXSLX,
    ...getItemSaleXLSX,
};