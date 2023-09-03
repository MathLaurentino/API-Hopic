import * as create from "./create";
import * as getAll from "./getAll";
import * as getCSV from "./getOrderSalesData";
import * as validateClientAccess from "./validateClientAccess";
import * as getItemSalesData from "./getItemSalesData";

export const OrderProvider = {
    ...create,
    ...getAll,
    ...getCSV,
    ...validateClientAccess,
    ...getItemSalesData,
};