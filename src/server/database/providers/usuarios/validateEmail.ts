import { Knex } from "../../knex";
import { ETableNames } from "../../ETableNames";
import { BadRequestError, InternalServerError } from "../../../shared/services";

export const validateEmail = async (chave: string): Promise<void> => {

    const [result] = await Knex(ETableNames.usuario).select("*").where("uniqueStringEmail", chave); // "isValid", "id"

    if (typeof result === "undefined" ) {
        throw new BadRequestError("chave invalida");
    }

    const update = await Knex(ETableNames.usuario).where("id", result.id).update({isValid: true, uniqueStringEmail: null});

    if (update > 0) return;

    throw new InternalServerError();
    
};