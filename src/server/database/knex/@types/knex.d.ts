import { IUser, IItem, IOrder, IOrderItem } from "../../models"; 

/**
 * Define a tipagem para o Knex
 */
declare module "knex/types/tables" {
  interface Tables {
    user: IUser,
    item: IItem,
    order: IOrder,
    orderItem: IOrderItem,
  }
}