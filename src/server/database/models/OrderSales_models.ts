interface ISalesOrderData {
    id: number;
    total_price: number;
    created_at: string; // timestemp
}

interface ISalesOrderItemData {
    order_id: number;
    item_id: number;
    item_name: string;
    quantity: number;
    item_price_at_time: number;
}
  

interface ISalesData {
    order_id: number;
    total_price: number;
    created_at: string;
    order_items: Omit<ISalesOrderItemData, "order_id">[];
}

export {ISalesOrderData, ISalesOrderItemData, ISalesData};