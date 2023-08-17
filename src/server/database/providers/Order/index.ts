import * as create from "./create";
import * as getAll from "./getAll";
import * as getCSV from "./getXLSX";
// import * as getById from "./getById";
// import * as deleteById from "./deleteById";
// import * as updateById from "./updateById";
import * as validateClientAccess from "./validateClientAccess";

export const OrderProvider = {
    ...create,
    ...getAll,
    ...getCSV,
    // ...getById,
    // ...deleteById,
    // ...updateById,
    ...validateClientAccess,
};