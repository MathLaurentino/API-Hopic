import * as create from "./create";
import * as getByOrderId from "./getByOrderId";
// import * as getAll from "./getAll";
// import * as getById from "./getById";
// import * as deleteById from "./deleteById";
// import * as updateById from "./updateById";
// import * as validateClientAccess from "./validateClientAccess";

export const OrderItemProvider = {
    ...create,
    ...getByOrderId,
    // ...getAll,
    // ...getById,
    // ...deleteById,
    // ...updateById,
    // ...validateClientAccess,
};