import { BadRequestError, UnauthorizedError } from "../../shared/services/ApiErrors";
import { OrderItemProvider } from "../../database/providers/OrderItem.ts";
import { validation } from "../../shared/middleware/Validation";
import { OrderProvider } from "../../database/providers/Order";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import * as yup from "yup";

interface IParamsProps {
    order_id?: number,
}

export const getByOrderIdValidation = validation((getSchema) => ({
    params: getSchema<IParamsProps>(yup.object().shape({
        order_id: yup.number().integer().required().moreThan(0),
    })),
})); 

export const getByOrderId = async (req: Request<IParamsProps>, res: Response): Promise<Response> => {

    const userId = Number(req.headers.user_id);
    const order_id = req.params.order_id;

    if (typeof order_id  === "undefined") {
        throw new BadRequestError("Parâmetro order_id é necessário"); 
    }

    const clientAccessToOrder = await OrderProvider.validateClientAccess(order_id, userId);

    if (!clientAccessToOrder) {
        throw new UnauthorizedError("Order_id não autorizado para esse usuário");
    }

    const orderItemArray = await OrderItemProvider.getbyOrderId(order_id);

    return res.status(StatusCodes.OK).json(orderItemArray);
    
};