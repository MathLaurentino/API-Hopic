import { NotFoundError } from "../../../shared/services/ApiErrors";
import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IUsuario } from "../../models";

export const updateById = async (user_id: number, user_data: IUsuario): Promise<void> => {

    const result = await Knex(ETableNames.usuario).where("id", user_id).update(user_data);

    // se foi alterado
    if (result > 0) {
        return;
    } 
    
    throw new NotFoundError("Id inválido");

};