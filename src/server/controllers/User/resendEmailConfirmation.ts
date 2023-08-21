import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { validation } from "../../shared/middleware/Validation";
import { UserProvider } from "../../database/providers/User";
import * as yup from "yup";
import { BadRequestError, SendEmail} from "../../shared/services";

interface IBodyProps {
    email: string;
}

export const resendEmailConfirmationValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        email: yup.string().required().min(5),
    })),
})); 

export const resendEmailConfirmation = async (req: Request<{}, {}, IBodyProps>, res: Response): Promise<Response> => {

    const {email} = req.body;
    
    const user_data = await UserProvider.getByEmail(email);

    if (user_data.isValid || user_data.uniqueStringEmail == null) {
        throw new BadRequestError("O endereço de e-mail associado a esta conta já foi confirmado.");
    }

    SendEmail.EmailConfirmation(user_data.name, user_data.email, user_data.uniqueStringEmail);

    return res.status(StatusCodes.OK).send(); 
      
};