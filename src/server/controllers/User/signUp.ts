import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { validation } from "../../shared/middleware/Validation";
import { UserProvider } from "../../database/providers/User";
import { ApiError, PasswordCrypto, RandString, SendEmail } from "../../shared/services";
import * as yup from "yup";

interface IBodyProps {
    name: string;
    email: string;
    password:string;
}

export const signUpValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        name: yup.string().required().min(2),
        email: yup.string().required().min(5),
        password: yup.string().required().min(6),
    })),
})); 

export const signUp = async (req: Request<{}, {}, IBodyProps>, res: Response): Promise<Response> => {

    const {email, name, password} = req.body;
    const is_new_email = await UserProvider.is_new_email(email);

    if (!is_new_email) { // se o email já é cadastrado
        throw new ApiError("email já cadastrado", StatusCodes.CONFLICT);
    }

    const hashedPassword = await PasswordCrypto.hashPassword(password);
    const uniqueStringEmail = RandString(email);
    const uniqueStringPassword = null;
    const isValid = false;

    const newUserId = await UserProvider.create({name, email, password: hashedPassword, isValid, uniqueStringEmail, uniqueStringPassword});
    await SendEmail.EmailConfirmation(name, email, uniqueStringEmail);

    if(process.env.NODE_ENV == "production") {
        return res.status(StatusCodes.CREATED).json(newUserId); 
    }else { // == dev
        return res.status(StatusCodes.CREATED).json(uniqueStringEmail); 
    }
      
};