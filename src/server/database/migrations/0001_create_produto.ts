import { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex) {

    return knex
        .schema
        .createTable(ETableNames.produto, table => {
            table.bigIncrements("id").primary().index();
            table.bigInteger("user_id")
                .index()
                .notNullable()
                .references("id")
                .inTable(ETableNames.user) // faz referencia a tabela cidade campo "id"
                .onUpdate("CASCADE") // caso o id da cidade seja mudado, muda aqui também
                .onDelete("RESTRICT"); // não deixa que o registro user seja apagado
            table.string("name").index().notNullable().checkLength(">=", 1);
            table.decimal("price", 10, 2).index().notNullable();
            table.string("imageAddress").index().nullable();

            table.comment("Tabela usada para armazenar Produtos no sistema.");
        })
        .then(() => {
            console.log(`# Created table ${ETableNames.produto}`);
        });
}

export async function down(knex: Knex) {
    return knex
        .schema
        .dropTable(ETableNames.produto)
        .then(() => {
            console.log(`# Dropped table ${ETableNames.produto}`); 
        });
}
