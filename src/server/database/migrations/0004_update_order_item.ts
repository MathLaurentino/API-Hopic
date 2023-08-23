import { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex) {

    await knex.schema.table(ETableNames.orderItem, (table) => {
        table.string("item_name");
    });

    // Atualizar os valores do novo campo "item_name"
    const orderItems = await knex(ETableNames.orderItem).select();
    for (const orderItem of orderItems) {
        const itemName = await knex
            .select("name")
            .from(ETableNames.item)
            .where("id", orderItem.item_id)
            .first();
        if (itemName) {
            await knex(ETableNames.orderItem)
                .where("id", orderItem.id)
                .update("item_name", itemName.name);
        }
    }

    await knex
        .schema
        .table(ETableNames.orderItem, table => {
            table.dropForeign(["item_id"]);
            table.dropColumn("item_id");
        })
        .then(() => {
            console.log(`# Created table ${ETableNames.orderItem}`);
        });

    return knex;
}

export async function down(knex: Knex) {
    await knex.schema.table(ETableNames.orderItem, (table) => {
        table.bigInteger("item_id")
            .index()
            // .notNullable()
            .references("id")
            .inTable(ETableNames.item)
            .onUpdate("CASCADE")
            .onDelete("RESTRICT");
    });

    // Atualizar os valores do campo "item_id"
    const orderItems = await knex(ETableNames.orderItem).select();
    for (const orderItem of orderItems) {
        const itemId = await knex
            .select("id")
            .from(ETableNames.item)
            .where("name", orderItem.item_name)
            .first();
        if (itemId) {
            await knex(ETableNames.orderItem)
                .where("id", orderItem.id)
                .update("item_id", itemId.id);
        }
    }

    await knex.schema.table(ETableNames.orderItem, (table) => {
        table.dropColumn("item_name");
    });

    return knex;
}