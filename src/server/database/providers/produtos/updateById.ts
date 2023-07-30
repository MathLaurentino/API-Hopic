import { NotFoundError } from "../../../shared/services/ApiErrors";
import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IProduto } from "../../models";

export const updateById = async (produtoId: number, produtoBody: Omit<IProduto, "id" | "user_id">): Promise<void> => {

    const result = await Knex(ETableNames.produto).where("id", produtoId).update(produtoBody);

    // se foi alterado
    if (result > 0) {
        return;
    } 
    
    throw new NotFoundError("Id inválido");

};