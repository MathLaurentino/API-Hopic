import * as create from "./create";
import * as getByOrderId from "./getByOrderId";

export const OrderItemProvider = {
    ...create,
    ...getByOrderId,
};