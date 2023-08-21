import { NotFoundError } from "../../../shared/services/ApiErrors";
import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IItem } from "../../models";

export const updateById = async (itemId: number, itemData: Omit<IItem, "id" | "user_id">): Promise<void> => {

    const result = await Knex(ETableNames.item).where("id", itemId).update(itemData);

    // se foi alterado
    if (result > 0) {
        return;
    } 
    
    throw new NotFoundError("Id inválido");

};