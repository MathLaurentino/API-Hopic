
import { Knex } from "../../knex";
import {ETableNames} from "../../ETableNames";
import { InternalServerError } from "../../../shared/services/ApiErrors";
// import { IOrder } from "../../models";

// interface IOrderBD extends Omit<IOrder, "user_id"> {}

interface OrderItem {
    order_id: number
    quantity: number;
    item_price_at_time: number;
    name: string;
}
  
interface Order {
    id: number;
    total_price: number;
    created_at: string; // Pode ser um objeto Date ou uma string formatada
}

interface CSVData {
    order_id: number;
    total_price: number;
    created_at: string;
    order_items: Omit<OrderItem, "order_id">[];
}

export const getCSV = async (user_id: number, created_at: Date, total_price: number): Promise<CSVData[]> => {

    const orderPromise = getOrder(user_id, created_at, total_price);
    const orderItemPromise = getOrderItem(user_id, created_at, total_price);

    const [orderData, orderItemData] = await Promise.all([orderPromise, orderItemPromise]);

    const CSVData = combineData(orderData, orderItemData);

    return CSVData;

};

const getOrder = async (user_id: number,created_at: Date, total_price: number): Promise<Order[]> => {
    
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

const getOrderItem = async (user_id: number, created_at: Date, total_price: number): Promise<OrderItem[]> => {
  
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

function combineData(orders: Order[], orderItems: OrderItem[]): CSVData[] {
    const combinedData: CSVData[] = [];
  
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