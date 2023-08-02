export interface IOrder{
    id: string;
    user_id: number;
    total_price: number;
    created_at: Date;  // UTC format
    // statuts: string;
    // paymentIntent_id: string;
}