import { Knex } from "../../knex";
import { ETableNames } from "../../ETableNames";

export const is_new_email = async (email: string): Promise<boolean> => {
   
    const [result] = await Knex(ETableNames.user).select("id").from(ETableNames.user).where("email", email);

    if (typeof result === "object") {
        return false; // email já cadastrado no BD
    } else {
        return true;
    }
    
};