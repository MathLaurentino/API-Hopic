import * as create from "./create";
import * as getAll from "./getAll";
import * as getCSV from "./getCSV";

export const OrderController = {
    ...create,
    ...getAll,
    ...getCSV
};