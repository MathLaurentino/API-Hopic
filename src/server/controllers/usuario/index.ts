import * as singUp from "./SingUp";
import * as singIp from "./SignIn";
import * as validateEmail from "./ValidateEmail";
import * as passwordReset from "./PasswordReset";
import * as newPassword from "./NewPassword";

export const UsuarioController = {
    ...singUp,
    ...singIp,
    ...validateEmail,
    ...passwordReset,
    ...newPassword
};