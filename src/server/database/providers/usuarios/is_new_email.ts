import { Knex } from "../../knex";
import { ETableNames } from "../../ETableNames";

export const is_new_email = async (email: string): Promise<boolean> => {
   
    const [result] = await Knex(ETableNames.usuario).select("id").from(ETableNames.usuario).where("email", email);

    if (typeof result === "object") {
        return false; // email já cadastrado no BD
    } else {
        return true;
    }
    
};