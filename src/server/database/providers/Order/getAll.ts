
import { Knex } from "../../knex";
import {ETableNames} from "../../ETableNames";
import { InternalServerError } from "../../../shared/services/ApiErrors";
import { IOrder } from "../../models";

export const getAll = async (user_id: number, page: number, limit: number, id = 0, created_at: Date, total_price: number): Promise<IOrder[]> => {
  
    // const result = await Knex(ETableNames.order).select("*").where("user_id", user_id);

    const result = await Knex(ETableNames.order)
        .select("id", "total_price", "created_at")
        .where("user_id", user_id)
        .andWhere("created_at", ">=", created_at)
        .andWhere("total_price", ">=", total_price)
        .offset((page - 1) * limit)
        .limit(limit);


    if (id > 0 && result.every(item => item.id !== id)) {
        const resultById = await Knex(ETableNames.order)
            .select("*")
            .where("id", id)
            .first();

        if (resultById) return [...result, resultById];
    }


    if (typeof result === "object") {
        return result;
    } 

    throw new InternalServerError();

};