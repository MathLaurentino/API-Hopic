import * as create from "./create";
import * as getAll from "./getAll";
import * as getCSV from "./getXLSX";
import * as validateClientAccess from "./validateClientAccess";

export const OrderProvider = {
    ...create,
    ...getAll,
    ...getCSV,
    ...validateClientAccess,
};