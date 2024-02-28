export interface IOrderItem{
    id: number;
    order_id: number; //fk
    item_id: number | null; // fk
    quantity: number;
    item_price_at_time: number;
}