import * as create from "./create";
import * as getAll from "./getAll";
import * as getById from "./getById";
import * as deleteById from "./deleteById";
import * as updateById from "./updateById";
import * as validateClientAccess from "./validateClientAccess";
import * as validateImgClientAccess from "./validateImgClientAccess";

export const ItemProvider = {
    ...create,
    ...getAll,
    ...getById,
    ...deleteById,
    ...updateById,
    ...validateClientAccess,
    ...validateImgClientAccess,
};