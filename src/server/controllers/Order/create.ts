import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthorizedError } from "../../shared/services";
import { ItemProvider } from "../../database/providers/Item";
import { OrderProvider } from "../../database/providers/Order";
import { IOrderItem } from "../../database/models";
import { OrderItemProvider } from "../../database/providers/OrderItem.ts";

interface IBodyProps {
    item_id: number;
    quantity: number;
}

interface IOrderItemArray extends Omit<IOrderItem, "id" | "order_id"> {}

/**
 * Cria um novo pedido associado a um usuário e seus itens.
 */
export const create = async (req: Request<{}, {}, IBodyProps[]>, res: Response): Promise<Response> => {

    // Extração dos dados da requisição
    const inputData: IBodyProps[] = req.body;
    const user_id = Number(req.headers.user_id);
    
    // Estrutura para armazenar os itens do pedido
    const orderItemArray: IOrderItemArray[] = []; // para o OrerItem
    let total_price: number = 0; // para o Order

    let x: number = 0;
    // Loop através dos items fornecidos na requisição
    for (const productInput of inputData) {

        const item_id = productInput.item_id;
        const quantity = productInput.quantity;

        // Obtenção dos detalhes do item do banco de dados através do ItemProvider
        const productDB = await ItemProvider.getbyId(item_id);

        // Verificação se o item pertence ao usuário atual
        if (productDB.user_id !== user_id) {
            throw new UnauthorizedError("item_id: " + item_id + " inválido para esse usuário");
        }

        const item_price_at_time = productDB.price;

        // Cálculo do preço total para o item atual
        total_price += item_price_at_time * quantity;

        // Adição do item ao array de itens do pedido
        orderItemArray[x] = { item_id, quantity, item_price_at_time };

        x++;
    }

    // Data de criação do pedido
    const created_at: Date = new Date();

    // Criação do pedido utilizando o OrderProvider
    const order_id = await OrderProvider.create({ user_id, total_price, created_at });

    // Criação dos itens do pedido utilizando o OrderItemProvider
    for (let x = 0; x < orderItemArray.length; x++) {
        await OrderItemProvider.create({ ...orderItemArray[x], order_id });
    }

    // Resposta com o order_id do pedido criado
    return res.status(StatusCodes.OK).json(order_id);
};



export const createValidation = (req: Request<{}, {}, IBodyProps[]>, res: Response, next: NextFunction) => {

    // const inputData = req.body;
    const inputData: IBodyProps[] = req.body;
  
    if (!Array.isArray(inputData)) {
        throw new BadRequestError("The input must be an array of objects.");
    }
  
    let bodyErrors: { [key: string]: string } = {};

    for (const product of inputData) {

        bodyErrors = {};

        if (!product.item_id) {
            bodyErrors["item_id"] = "item_id is a required field";
        } 
        else if (typeof product.item_id !== "number") {
            bodyErrors["item_id"] = "item_id must be a 'number' type";
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

    }

    if ( typeof bodyErrors.item_id !== "undefined" || typeof bodyErrors.quantity !== "undefined") {
        res.status(StatusCodes.BAD_REQUEST).json({
            "errors":{
                "body":{
                    ...bodyErrors
                }
            }
        });
    } else {
        next();
    }
  
};