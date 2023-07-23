import { UnauthorizedError } from "../../../shared/services";
import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IUsuario } from "../../models";

export const getByEmail = async (email: string): Promise<IUsuario> => {

    const result = await Knex(ETableNames.usuario)
        .select("*")
        .where("email", email)
        .first();

    if (typeof result === "object") {
        return result;
    } else {
        throw new UnauthorizedError("email ou senha inválidos");
    } 

};