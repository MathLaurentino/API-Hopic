import { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex) {

    return knex
        .schema
        .createTable(ETableNames.item, table => {
            table.bigIncrements("id").primary().index();
            table.bigInteger("user_id")
                .index()
                .notNullable()
                .references("id")
                .inTable(ETableNames.user) // faz referencia a tabela user campo "id"
                .onUpdate("CASCADE") // caso o id do usar seja mudado, muda aqui também
                .onDelete("RESTRICT"); // não deixa que o registro user seja apagado
            table.string("name").index().notNullable().checkLength(">=", 1);
            table.decimal("price", 10, 2).index().notNullable();
            table.string("color").index().notNullable().checkLength("=", 6);
            table.string("imageAddress").index().nullable();

            table.comment("Tabela usada para armazenar os items no sistema.");
        })
        .then(() => {
            console.log(`# Created table ${ETableNames.item}`);
        });
}

export async function down(knex: Knex) {
    return knex
        .schema
        .dropTable(ETableNames.item)
        .then(() => {
            console.log(`# Dropped table ${ETableNames.item}`); 
        });
}
