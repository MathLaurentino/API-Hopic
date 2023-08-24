import { Knex } from "../../knex";
import {ETableNames} from "../../ETableNames";
import { NotFoundError } from "../../../shared/services/ApiErrors";

export const validateImgClientAccess = async (imageAddress: string, user_id: number): Promise<boolean> => {
   
    const [result] = await Knex(ETableNames.item).select("user_id").where("imageAddress", imageAddress);

    if (typeof result === "object") {
        if (result.user_id == user_id) 
            return true;
        else 
            return false;
    } 

    throw new NotFoundError("ImageAddress inválido");
    
};