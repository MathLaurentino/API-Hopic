import { Knex } from "../../knex";
import {ETableNames} from "../../ETableNames";
import { ItemSalesData } from "../../models";


/**
 * Função que obtém dados de vendas de itens, retornando um objeto contendo a
 * quantidade de vendas de cada item, bem como o item_price_at_time no momento
 * da venda.
 *
 * @param user_id - O ID do usuário para o qual deseja-se obter dados de vendas.
 * @param created_at - O timestamp a partir do qual deseja-se recuperar os dados de vendas.
 * @returns Um objeto contendo os dados de vendas dos itens.
 */
export const getItemSalesData = async (user_id: number, created_at: number): Promise<ItemSalesData[]> => {
    
    const result: ItemSalesData[] = await Knex(ETableNames.item)
        .select("i.id", "i.name", "oi.item_price_at_time", Knex.raw("SUM(oi.quantity) as quantity"))
        .from(ETableNames.item + " as i")
        .innerJoin(ETableNames.orderItem + " as oi", "oi.item_id", "i.id")
        .innerJoin(ETableNames.order + " as o", "o.id", "oi.order_id")
        .groupBy("i.id", "i.name", "oi.item_price_at_time")
        .where("o.user_id", user_id)
        .andWhere("o.created_at", ">=", created_at);

    return result;
};

