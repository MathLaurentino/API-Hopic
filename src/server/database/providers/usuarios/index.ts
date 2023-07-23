import * as create from "./create";
import * as is_new_email from "./is_new_email";
import * as getByEmail from "./getByEmail";

export const UsuarioProvider = {
    ...create,
    ...is_new_email,
    ...getByEmail,
};