
import { Knex } from "../../knex";
import { IItem } from "../../models";
import {ETableNames} from "../../ETableNames";

export const create = async (item: Omit<IItem, "id">): Promise<number> => {
    
    const [result] = await Knex(ETableNames.item).insert(item).returning("id");

    if (typeof result === "object") {
        return result.id;
    } else  { // "number"
        return result;
    }

};