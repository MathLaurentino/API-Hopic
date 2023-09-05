import * as create from "./create";
import * as getAll from "./getAll";
import * as getById from "./getById";
import * as deleteById from "./deleteById";
import * as updateById from "./updateById";
import * as getImg from "./getImg";
import * as getItemSales from "./getItemSales";

export const ItemController = {
    ...create,
    ...getAll,
    ...getById,
    ...deleteById,
    ...updateById,
    ...getImg,
    ...getItemSales,
};