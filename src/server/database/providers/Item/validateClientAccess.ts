
import { Knex } from "../../knex";
import {ETableNames} from "../../ETableNames";
import { NotFoundError } from "../../../shared/services/ApiErrors";

export const validateClientAccess = async (itemId: number, user_id: number): Promise<boolean> => {
  
    const [result] = await Knex(ETableNames.item).select("user_id").where("id", itemId);

    if (typeof result === "object") {
        return result.user_id === user_id;
    } 

    throw new NotFoundError("Id inválido");
};