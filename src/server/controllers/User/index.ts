import * as signUp from "./signUp";
import * as signIp from "./signIn";
import * as validateEmail from "./validateEmail";
import * as passwordReset from "./passwordReset";
import * as newPassword from "./newPassword";
import * as resendEmailConfirmation from "./resendEmailConfirmation";

export const UserController = {
    ...signUp,
    ...signIp,
    ...validateEmail,
    ...passwordReset,
    ...newPassword,
    ...resendEmailConfirmation
};