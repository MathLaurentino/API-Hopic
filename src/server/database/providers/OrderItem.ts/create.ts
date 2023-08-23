
import { Knex } from "../../knex";
import { IOrderItem } from "../../models";
import {ETableNames} from "../../ETableNames";

export const create = async (orderItem: Omit<IOrderItem, "id" | "item_id">): Promise<number> => {
    
    const [result] = await Knex(ETableNames.orderItem).insert(orderItem).returning("id");

    if (typeof result === "object") {
        return result.id;
    } else  { // "number"
        return result;
    }

};