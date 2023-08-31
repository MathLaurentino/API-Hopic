export interface IOrder{
    id: string;
    user_id: number;
    total_price: number;
    created_at: number;  // UTC format -> timestamp
}