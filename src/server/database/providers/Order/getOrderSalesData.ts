import { Knex } from "../../knex";
import {ETableNames} from "../../ETableNames";
import { ApiError, InternalServerError } from "../../../shared/services/ApiErrors";
import { ISalesData, ISalesOrderItemData, ISalesOrderData } from "../../models";
import { StatusCodes } from "http-status-codes";

/**
 * Retorna os dados de relatorio de vendas com base nos critérios fornecidos.
 * @param user_id - ID do usuário associado aos pedidos.
 * @param created_at - Data de criação mínima dos pedidos.
 * @param total_price - Preço total mínimo dos pedidos.
 * @returns Uma Promise que resolve em um array de objetos ISalesData.
 */
export const getOrderSalesData = async (user_id: number, created_at: number, total_price: number): Promise<ISalesData[]> => {
    
    const orderData = await getOrder(user_id, created_at, total_price);
    const orderItemData = await getOrderItem(user_id, created_at, total_price);

    const ISalesData = combineData(orderData, orderItemData);

    return ISalesData;
};


/**
 * Obtém os dados do pedido baseados em critérios como user_id, data de criação e preço total.
 */
const getOrder = async (user_id: number,created_at: number, total_price: number): Promise<ISalesOrderData[]> => {
    
    const result: ISalesOrderData[] = await Knex(ETableNames.order)
        .select("o.id", "o.total_price", "o.created_at")
        .from(ETableNames.order + " as o")
        .where("o.user_id", user_id)
        .andWhere("created_at", ">=", created_at)
        .andWhere("total_price", ">=", total_price);
    
    if (result.length > 0) {
        return result;
    } 
        
    throw new ApiError("Usuario ainda não possui ordens criadas", StatusCodes.NO_CONTENT);

};


/**
 * Obtém os dados dos itens de pedido baseados em critérios como user_id, data de criação e preço total.
 */
const getOrderItem = async (user_id: number, created_at: number, total_price: number): Promise<ISalesOrderItemData[]> => {
  
    const result: ISalesOrderItemData[] = await Knex.queryBuilder()
        .select("oi.order_id", "i.id as item_id", "i.name as item_name", "oi.quantity", "oi.item_price_at_time")
        .from(ETableNames.order + " as o")
        .innerJoin(ETableNames.orderItem + " as oi", "o.id", "oi.order_id")
        .innerJoin(ETableNames.item + " as i", "oi.item_id", "i.id")
        .where("o.user_id", user_id)
        .andWhere("o.created_at", ">=", created_at)
        .andWhere("o.total_price", ">=", total_price);


    if (result.length > 0) {
        return result;
    } 

    throw new InternalServerError("Usuario " + user_id + " tem uma(s) 'Order' sem 'OrderItem'");

};


/**
 * Combina os dados de pedidos e itens de pedidos em uma estrutura de dados especifica que
 * fascilita o processo de criação do XLSX posteriormente
 */
function combineData(orders: ISalesOrderData[], orderItems: ISalesOrderItemData[]): ISalesData[] {
    const combinedData: ISalesData[] = [];
  
    orders.forEach(order => {
        const orderItemsForOrder = orderItems.filter(item => item.order_id === order.id);
  
        combinedData.push({
            order_id: order.id,
            total_price: order.total_price,
            created_at: order.created_at,
            order_items: orderItemsForOrder.map(item => ({
                item_id: item.item_id,
                item_name: item.item_name,
                quantity: item.quantity,
                item_price_at_time: item.item_price_at_time,
            })),
        });
    });
  
    return combinedData;
}