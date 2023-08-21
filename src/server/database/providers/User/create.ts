import { Knex } from "../../knex";
import { IUser } from "../../models";
import { ETableNames } from "../../ETableNames";
import { InternalServerError } from "../../../shared/services";

export const create = async (user: Omit<IUser, "id" >): Promise<number> => {

    const [result] = await Knex(ETableNames.user).insert({...user}).returning("id");

    if (typeof result === "object") {
        return Number(result.id);
    } else if (typeof result === "number") {
        return result;
    } else {
        throw new InternalServerError();
    }
    
};