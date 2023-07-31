import { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex) {

    return knex
        .schema
        .createTable(ETableNames.orderItem, table => {
            table.bigIncrements("id").primary().index();
            table.bigInteger("produto_id")
                .index()
                .notNullable()
                .references("id")
                .inTable(ETableNames.produto) // faz referencia a tabela cidade campo "id"
                .onUpdate("CASCADE") // caso o id da cidade seja mudado, muda aqui também
                .onDelete("RESTRICT"); // não deixa que o registro usuario seja apagado
            table.bigInteger("order_id")
                .index()
                .notNullable()
                .references("id")
                .inTable(ETableNames.order) // faz referencia a tabela cidade campo "id"
                .onUpdate("CASCADE") // caso o id da cidade seja mudado, muda aqui também
                .onDelete("RESTRICT"); // não deixa que o registro usuario seja apagado
            table.integer("quantity").notNullable();           
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
