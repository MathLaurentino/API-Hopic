
import { Knex } from "../../knex";
import {ETableNames} from "../../ETableNames";
import { InternalServerError } from "../../../shared/services/ApiErrors";
import { XLSXData, XLSXOrderItemData, XLSXOrderData } from "../../models";

/**
 * Obtém os dados no formato XLSX com base nos critérios fornecidos.
 * @param user_id - ID do usuário associado aos pedidos.
 * @param created_at - Data de criação mínima dos pedidos.
 * @param total_price - Preço total mínimo dos pedidos.
 * @returns Uma Promise que resolve em um array de objetos XLSXData.
 */
export const getXLSX = async (user_id: number, created_at: Date, total_price: number): Promise<XLSXData[]> => {

    const orderPromise = getOrder(user_id, created_at, total_price);
    const orderItemPromise = getOrderItem(user_id, created_at, total_price);

    const [orderData, orderItemData] = await Promise.all([orderPromise, orderItemPromise]);

    const XLSXData = combineData(orderData, orderItemData);

    return XLSXData;

};


/**
 * Obtém os dados do pedido baseados em critérios como user_id, data de criação e preço total.
 */
const getOrder = async (user_id: number,created_at: Date, total_price: number): Promise<XLSXOrderData[]> => {
    
    const result = await Knex(ETableNames.order)
        .select("o.id", "o.total_price", "o.created_at")
        .from(ETableNames.order + " as o")
        .where("o.user_id", user_id)
        .andWhere("created_at", ">=", created_at)
        .andWhere("total_price", ">=", total_price);

    if (result.length > 0) {
        return result;
    } 

    throw new InternalServerError();

};


/**
 * Obtém os dados dos itens de pedido baseados em critérios como user_id, data de criação e preço total.
 */
const getOrderItem = async (user_id: number, created_at: Date, total_price: number): Promise<XLSXOrderItemData[]> => {
  
    const result = await Knex(ETableNames.order)
        .select("i.order_id", "i.quantity", "i.item_price_at_time","p.name")
        .from(ETableNames.order + " as o")
        .innerJoin(ETableNames.orderItem + " as i", "o.id", "i.order_id")
        .innerJoin(ETableNames.produto + " as p", "p.id", "i.produto_id")
        .where("o.user_id", user_id)
        .andWhere("o.created_at", ">=", created_at)
        .andWhere("o.total_price", ">=", total_price);


    if (result.length > 0) {
        return result;
    } 

    throw new InternalServerError();

};


/**
 * Combina os dados de pedidos e itens de pedidos em uma estrutura de dados especifica que
 * fascilita o processo de criação do XLSX posteriormente
 */
function combineData(orders: XLSXOrderData[], orderItems: XLSXOrderItemData[]): XLSXData[] {
    const combinedData: XLSXData[] = [];
  
    orders.forEach(order => {
        const orderItemsForOrder = orderItems.filter(item => item.order_id === order.id);
  
        combinedData.push({
            order_id: order.id,
            total_price: order.total_price,
            created_at: order.created_at,
            order_items: orderItemsForOrder.map(item => ({
                quantity: item.quantity,
                item_price_at_time: item.item_price_at_time,
                name: item.name,
            })),
        });
    });
  
    return combinedData;
}