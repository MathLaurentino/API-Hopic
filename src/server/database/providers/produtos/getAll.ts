
import { Knex } from "../../knex";
import {ETableNames} from "../../ETableNames";
import { InternalServerError } from "../../../shared/services/ApiErrors";
import { IProduto } from "../../models";

export const getAll = async (user_id: number): Promise<IProduto[]> => {
  
    const result = await Knex(ETableNames.produto).select("*").where("user_id", user_id);

    if (typeof result === "object") {
        return result;
    } 

    throw new InternalServerError();

};