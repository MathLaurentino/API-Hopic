
import { Knex } from "../../knex";
import {ETableNames} from "../../ETableNames";
import { NotFoundError } from "../../../shared/services/ApiErrors";

export const validateClientAccess = async (orderId: number, user_id: number): Promise<boolean> => {
  
    const [result] = await Knex(ETableNames.order).select("user_id").where("id", orderId);

    if (typeof result === "object") {
        return result.user_id === user_id;
    } 

    throw new NotFoundError("Id inválido");
};