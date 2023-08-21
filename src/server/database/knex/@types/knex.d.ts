import { IUser, IProduto, IOrder, IOrderItem } from "../../models"; 

/**
 * Define a tipagem para o Knex
 */
declare module "knex/types/tables" {
  interface Tables {
    user: IUser,
    produto: IProduto,
    order: IOrder,
    orderItem: IOrderItem,
  }
}