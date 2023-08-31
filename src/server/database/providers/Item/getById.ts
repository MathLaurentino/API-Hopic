import { Knex } from "../../knex";
import {ETableNames} from "../../ETableNames";
import {  UnauthorizedError } from "../../../shared/services/ApiErrors";
import { IItem } from "../../models";

export const getbyId = async (id: number): Promise<IItem> => {
   
    const [result] = await Knex(ETableNames.item).select("*").where("id", id);

    if (typeof result === "object") {
        return result;
    } 

    throw new UnauthorizedError("item_id: " + id + " inválido para esse usuário");    
};