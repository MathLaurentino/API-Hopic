import * as singUp from "./SingUp";
import * as singIp from "./SignIn";
import * as validateEmail from "./ValidateEmail";

export const UsuarioController = {
    ...singUp,
    ...singIp,
    ...validateEmail,
};