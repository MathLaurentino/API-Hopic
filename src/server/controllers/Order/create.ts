import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../../shared/services";

interface IBodyProps {
    produto_id: number;
    quantity: number;
}


export const create = async (req: Request<{}, {}, IBodyProps>, res: Response): Promise<Response> => {

    return res.status(StatusCodes.OK).send(); // devolve o id criado
    
};



export const createValidation = (req: Request<{}, {}, IBodyProps>, res: Response, next: NextFunction) => {

    const inputData = req.body;
  
    if (!Array.isArray(inputData)) {
        throw new BadRequestError("The input must be an array of objects.");
    }
  
    for (const product of inputData) {

        const bodyErrors: { [key: string]: string } = {};

        if (!product.produto_id) {
            bodyErrors["produto_id"] = "produto_id is a required field";
        } 
        else if (typeof product.produto_id !== "number") {
            bodyErrors["produto_id"] = "produto_id must be a 'number' type";
        }

        if (!product.quantity) {
            bodyErrors["quantity"] = "quantity is a required field";
        }
        else if (typeof product.quantity !== "number") {
            bodyErrors["quantity"] = "quantity must be a 'number' type";
        }
        else if (product.quantity <= 0) {
            bodyErrors["quantity"] = "quantity must be greater than 0";
        }

        if ( typeof bodyErrors.produto_id !== "undefined" || typeof bodyErrors.quantity !== "undefined") {
            res.status(StatusCodes.BAD_REQUEST).json({
                "errors":{
                    "body":{
                        ...bodyErrors
                    }
                }
            });
        }

        break;
    }
  
    next();
};