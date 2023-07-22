import knex from "knex";

import {development, test, production } from "./Environment";

/**
 * Seleciona qual ambiente será usado 
 * (esta definido no arquivo .env)
 */
const getEnvironment = () => {
    switch(process.env.NODE_ENV) {
        case "production": return production;
        case "test": return test;

        default: return development;
    }
};

/**
 * exporta uma instancia do Knex com as configurações definidas no 
 * arquivo "./Environment" e selecionado na function getEnvironment
 */
export const Knex = knex(getEnvironment());