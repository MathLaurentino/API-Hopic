import { UserProvider } from "../../database/providers/User";
import { UnauthorizedError, RandString, SendEmail } from "../../shared/services";
import { validation } from "../../shared/middleware";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import * as yup from "yup";

interface IBodyProps {
    email: string;
}

/**
 * Valida o campo Email
 */
export const passwordResetValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        email: yup.string().required(),
    })),
}));

/**
 * Envia o email com a chave de altorização para nova password
 */
export const passwordResetRequest = async (req: Request<{}, {}, IBodyProps>, res: Response): Promise<Response> => {

    const email = req.body.email;

    const user_data = await UserProvider.getByEmail(email);

    if (!user_data.isValid) {
        throw new UnauthorizedError("Email não confirmado");
    }

    user_data.uniqueStringPassword = RandString(email);

    SendEmail.EmailNewPassWord(user_data.name, user_data.email, user_data.uniqueStringPassword);

    await UserProvider.updateById(user_data.id, user_data);

    return res.status(StatusCodes.OK).send();
 
};