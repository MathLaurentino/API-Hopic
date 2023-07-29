import { Knex } from "../../knex";
import {ETableNames} from "../../ETableNames";
import { NotFoundError } from "../../../shared/services/ApiErrors";
import { IProduto } from "../../models";

export const getbyId = async (id: number): Promise<IProduto> => {
   
    const [result] = await Knex(ETableNames.produto).select("*").where("id", id);

    if (typeof result === "object") {
        return result;
    } 

    throw new NotFoundError("Id inválido");
    
};