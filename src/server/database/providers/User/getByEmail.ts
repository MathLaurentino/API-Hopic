import { UnauthorizedError } from "../../../shared/services";
import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IUser } from "../../models";

export const getByEmail = async (email: string): Promise<IUser> => {

    const result = await Knex(ETableNames.user)
        .select("*")
        .where("email", email)
        .first();

    if (typeof result === "object") {
        return result;
    } else {
        throw new UnauthorizedError("email inválidos");
    } 

};