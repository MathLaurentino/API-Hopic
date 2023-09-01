import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthorizedError } from "../../shared/services";
import { ItemProvider } from "../../database/providers/Item";
import { OrderProvider } from "../../database/providers/Order";
import { OrderItemProvider } from "../../database/providers/OrderItem.ts";

interface IBodyProps {
    item_id: number;
    quantity: number;
}


/**
 * Cria um novo pedido associado a um usuário e seus itens.
 */
export const create = async (req: Request<{}, {}, IBodyProps[]>, res: Response): Promise<Response> => {

    // Extração dos dados da requisição
    const inputData = req.body;
    const user_id = Number(req.headers.user_id);
    
    const [orderItemArray, total_price] = await createOrderItemArray(inputData, user_id);

    // cria a "Ordem"
    const created_at: Date = new Date();
    const timestamp: number = created_at.getTime() * 1000; // convertendo milissegundos em microssegundos
    const order_id = await OrderProvider.create({ user_id, total_price, created_at: timestamp });

    // cria os "Order_item" do "Order"
    for (let x = 0; x < orderItemArray.length; x++) {
        await OrderItemProvider.create({ ...orderItemArray[x], order_id });
    }

    // Resposta com o order_id do pedido criado
    return res.status(StatusCodes.OK).json(order_id);
};



// interface IOrderItemArray extends Omit<IOrderItem, "id" | "order_id"> {}
export interface IOrderItemArray{
    item_id: number; // fk
    item_name: string;
    quantity: number;
    item_price_at_time: number;
}



/**
 * Cria um array de itens de pedido a partir dos dados fornecidos e calcula o preço total.
 * 
 * @param inputData - Os dados do corpo da requisição contendo os itens do pedido.
 * @param user_id - O ID do usuário associado ao pedido.
 * @returns Uma promise contendo um array de itens de pedido e o preço total calculado.
 */
const createOrderItemArray = async (inputData: IBodyProps[], user_id: number): Promise<[IOrderItemArray[], number]> => {

    // Estrutura para armazenar os itens do pedido
    const orderItemArray: IOrderItemArray[] = []; // para o OrerItem
    let total_price: number = 0; // para o Order

    let x: number = 0;
    // Loop através dos items fornecidos na requisição
    for (const productInput of inputData) {

        // verifica permição do usuario
        const item_id = productInput.item_id;
        const item_data = await ItemProvider.getbyId(item_id);
        if (item_data.user_id !== user_id) {
            throw new UnauthorizedError("item_id: " + item_id + " inválido para esse usuário");
        }

        // armazena os dados da tabela "order_item"
        const item_name = item_data.name;
        const quantity = productInput.quantity;
        const item_price_at_time = item_data.price;
        orderItemArray[x] = { item_name, quantity, item_price_at_time, item_id };

        // calcula o total_price do Oreder
        total_price += item_price_at_time * quantity;
        
        x++;
    }

    return [orderItemArray, total_price];

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