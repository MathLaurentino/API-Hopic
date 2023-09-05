import { Knex } from "../../knex";
import {ETableNames} from "../../ETableNames";

/**
 * Verifica se há uma relação de chave estrangeira entre a tabela 'orderItem'.
 * 
 * @param item_id O ID do item que se deseja verificar em relação à chave estrangeira.
 * @returns Retorna um valor booleano, onde 'true' indica que há uma relação de chave estrangeira
 *          entre 'orderItem' e 'item', e 'false' indica que não há relação.
 */
export const checkForeignKeyRelation = async (item_id: number): Promise<boolean> => {
   
    const [result] = await Knex(ETableNames.orderItem).select("id").where("item_id", item_id).limit(1);

    if (typeof result.id === "number") {
        return true;
    } else {
        return false;
    } 

};