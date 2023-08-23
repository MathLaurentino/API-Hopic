interface XLSXOrderItemData {
    order_id: number;
    quantity: number;
    item_price_at_time: number;
    item_name: string;
}
  
interface XLSXOrderData {
    id: number;
    total_price: number;
    created_at: string; // Pode ser um objeto Date ou uma string formatada
}

interface XLSXData {
    order_id: number;
    total_price: number;
    created_at: string;
    order_items: Omit<XLSXOrderItemData, "order_id">[];
}

export {XLSXOrderItemData, XLSXOrderData, XLSXData};