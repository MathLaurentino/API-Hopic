
import { Knex } from "../../knex";
import { IProduto } from "../../models";
import {ETableNames} from "../../ETableNames";

export const create = async (produto: Omit<IProduto, "id">): Promise<number> => {
    
    const [result] = await Knex(ETableNames.produto).insert(produto).returning("id");

    if (typeof result === "object") {
        return result.id;
    } else  { // "number"
        return result;
    }

};