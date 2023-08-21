import { Knex } from "../../knex";
import { ETableNames } from "../../ETableNames";
import { BadRequestError, InternalServerError } from "../../../shared/services";

/**
 * Valida um uniqueStringEmail.
 *
 * Esta função verifica se a chave fornecida corresponde a um registro de usuário com um
 * uniqueStringEmail no banco de dados. Se for encontrado um registro correspondente,
 * o estado de validade da conta (isValid) é atualizado para verdadeiro (true) e o 
 * uniqueStringEmail é definido como nulo (null) no banco de dados.
 *
 * @param chave A chave única associada ao endereço de email a ser validado.
 */
export const validateEmail = async (chave: string): Promise<void> => {

    const [result] = await Knex(ETableNames.user).select("*").where("uniqueStringEmail", chave); // "isValid", "id"

    if (typeof result === "undefined" ) {
        throw new BadRequestError("chave invalida");
    }

    const update = await Knex(ETableNames.user).where("id", result.id).update({isValid: true, uniqueStringEmail: null});

    if (update > 0) return;

    throw new InternalServerError();
    
};