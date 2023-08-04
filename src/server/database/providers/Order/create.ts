
import { Knex } from "../../knex";
import { IOrder } from "../../models";
import {ETableNames} from "../../ETableNames";

export const create = async (order: Omit<IOrder, "id">): Promise<number> => {
    
    const [result] = await Knex(ETableNames.order).insert(order).returning("id");

    if (typeof result === "object") {
        return Number(result.id);
    } else  { // "number"
        return result;
    }

};