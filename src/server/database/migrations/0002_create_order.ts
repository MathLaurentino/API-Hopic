import { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex) {

    return knex
        .schema
        .createTable(ETableNames.order, table => {
            table.bigIncrements("id").primary().index();
            table.bigInteger("user_id")
                .index()
                .notNullable()
                .references("id")
                .inTable(ETableNames.usuario) // faz referencia a tabela cidade campo "id"
                .onUpdate("CASCADE") // caso o id da cidade seja mudado, muda aqui também
                .onDelete("RESTRICT"); // não deixa que o registro usuario seja apagado
            table.enum("status", ["received", "paid"]).index().notNullable().defaultTo("received");
            table.decimal("total_price", 10, 2).notNullable();
            // table.string("paymentIntent_id");
            table.dateTime("created_at").notNullable();

            table.comment("Tabela usada para armazenar Orders do sistema.");
        })
        .then(() => {
            console.log(`# Created table ${ETableNames.order}`);
        });
}


export async function down(knex: Knex) {
    return knex
        .schema
        .dropTable(ETableNames.order)
        .then(() => {
            console.log(`# Dropped table ${ETableNames.order}`); 
        });
}
