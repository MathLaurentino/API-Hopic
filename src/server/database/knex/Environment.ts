import { Knex } from "knex";
import path from "path";

/** Esse arquivo exporta três objetos de configuração para o Knex */


/** 
 *      Ambiente de desenvolvimento 
 * Usa o SQLite como o cliente de banco de dados  
 * Define as pastas de migrations e seeds para o banco de dados
 * Inclui uma função que é executada após a criação de cada conexão 
 *      para ativar a verificação de chaves estrangeiras.
 */
export const development: Knex.Config = {
    client: "sqlite3",
    useNullAsDefault: true,
    connection: {
        filename: path.resolve(__dirname, "..", "..", "..", "..", "database.sqlite"),
    },
    migrations: {
        directory: path.resolve(__dirname, "..", "migrations"),
    },
    seeds: {
        directory: path.resolve(__dirname, "..", "seeds"),
    },
    pool: {
        afterCreate: (connection: any, done: Function) => {
            connection.run("PRAGMA foreign_keys = ON");
            done();
        }
    }
};

/**     
 *      Ambiente de teste
 * semelhante ao objeto "development", mas usa um banco de dados 
 *      em memória para testes em vez de um arquivo de banco de 
 *      dados SQLite.
 */
export const test: Knex.Config = {
    ...development,
    connection: ":memory:",
};


/**
 *      Ambiente de Produção
 * Falta implementar
 */
export const production: Knex.Config = {
    ...development,
};