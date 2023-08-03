import { Knex } from "../../knex";
import {ETableNames} from "../../ETableNames";
import { NotFoundError } from "../../../shared/services/ApiErrors";
import { IOrderItem } from "../../models";

export const getbyOrderId = async (order_id: number): Promise<IOrderItem[]> => {
   
    const result = await Knex(ETableNames.orderItem).select("*").where("order_id", order_id);

    if (typeof result === "object") {
        return result;
    } 

    throw new NotFoundError("Id inválido");
    
};