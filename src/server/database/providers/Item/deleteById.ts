import { Knex } from "../../knex";
import {ETableNames} from "../../ETableNames";
import { NotFoundError } from "../../../shared/services/ApiErrors";

export const deleteById = async (id: number): Promise<void> => {
  
    const result = await Knex(ETableNames.item).where("id", id).del();

    // se apagou o registro
    if (result === 1) {
        return;
    } 
    
    throw new NotFoundError("Id inválido");
    
};