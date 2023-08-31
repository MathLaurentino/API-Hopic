import { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex) {

    return knex
        .schema
        .createTable(ETableNames.orderItem, table => {
            table.bigIncrements("id").primary().index();
            table.bigInteger("order_id")
                .index()
                .notNullable()
                .references("id")
                .inTable(ETableNames.order) // faz referencia a tabela order_id campo "id"
                .onUpdate("CASCADE") // caso o id da order_id seja mudado, muda aqui também
                .onDelete("RESTRICT"); // não deixa que o registro user seja apagado
            table.bigInteger("item_id")
                .index()
                .references("id")
                .inTable(ETableNames.item) // faz referencia a tabela item campo "id"
                .onUpdate("CASCADE") // caso o id da item seja mudado, muda aqui também
                .onDelete("SET NULL");
            table.integer("quantity").notNullable();
            table.string("item_name").notNullable();
            table.decimal("item_price_at_time", 10, 2).notNullable();

            table.comment("Tabela usada para armazenar OrderItems do sistema.");
        })
        .then(() => {
            console.log(`# Created table ${ETableNames.orderItem}`);
        });
}


export async function down(knex: Knex) {
    return knex
        .schema
        .dropTable(ETableNames.orderItem)
        .then(() => {
            console.log(`# Dropped table ${ETableNames.orderItem}`); 
        });
}
