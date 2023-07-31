export interface IOrder{
    id: string;
    user_is: number;
    statuts: string;
    total_price: number;
    // paymentIntent_id: string;
    created_at: string;  // UTC format
}