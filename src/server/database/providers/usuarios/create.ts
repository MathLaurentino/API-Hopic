import { Knex } from "../../knex";
import { IUsuario } from "../../models";
import { ETableNames } from "../../ETableNames";
import { InternalServerError, PasswordCrypto } from "../../../shared/services";

export const create = async (usuario: Omit<IUsuario, "id" >): Promise<number> => {

    const hashedPassword = await PasswordCrypto.hashPassword(usuario.senha);

    const [result] = await Knex(ETableNames.usuario).insert({...usuario, senha: hashedPassword}).returning("id");

    if (typeof result === "object") {
        return Number(result.id);
    } else if (typeof result === "number") {
        return result;
    } else {
        throw new InternalServerError();
    }
    
};