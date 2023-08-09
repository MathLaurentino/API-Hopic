import * as EmailConfirmation from "./EmailConfirmation";
import * as EmailNewPassWord from "./EmailNewPassWord";

export const SendEmail = {
    ...EmailConfirmation,
    ...EmailNewPassWord
};
