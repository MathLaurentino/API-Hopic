import * as create from "./create";
import * as is_new_email from "./is_new_email";
import * as getByEmail from "./getByEmail";
import * as validateEmail from "./validateEmail";
import * as updateById from "./updateById";

export const UserProvider = {
    ...create,
    ...is_new_email,
    ...getByEmail,
    ...validateEmail,
    ...updateById
};