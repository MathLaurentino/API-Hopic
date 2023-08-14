interface CSVOrderItemData {
    order_id: number
    quantity: number;
    item_price_at_time: number;
    name: string;
}
  
interface CSVOrderData {
    id: number;
    total_price: number;
    created_at: string; // Pode ser um objeto Date ou uma string formatada
}

interface CSVData {
    order_id: number;
    total_price: number;
    created_at: string;
    order_items: Omit<CSVOrderItemData, "order_id">[];
}

export {CSVOrderItemData, CSVOrderData, CSVData};