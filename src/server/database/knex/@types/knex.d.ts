import { IUsuario, IProduto, IOrder, IOrderItem } from "../../models"; 

/**
 * Define a tipagem para o Knex
 */
declare module "knex/types/tables" {
  interface Tables {
    usuario: IUsuario,
    produto: IProduto,
    order: IOrder,
    orderItem: IOrderItem,
  }
}