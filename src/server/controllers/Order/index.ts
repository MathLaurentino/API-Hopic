import * as create from "./create";
import * as getAll from "./getAll";
import * as getXLSX from "./getXLSX";

export const OrderController = {
    ...create,
    ...getAll,
    ...getXLSX
};