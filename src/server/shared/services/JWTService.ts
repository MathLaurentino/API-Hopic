
import * as jwt from "jsonwebtoken";


/**
 * Interface que representa as informações que devem ser armazenadas em um token JWT.
 */
interface IJwtData{
    uid: number;
}


/**
 * Função que gera um novo token JWT com base nas informações fornecidas.
 */
const sign = (data: IJwtData): string | "JWT_SECRET_NOT_FOUND"  => {

    if (!process.env.JWT_SECRET) {
        return "JWT_SECRET_NOT_FOUND";
    }

    return jwt.sign(data, process.env.JWT_SECRET, {expiresIn: "1000h"});

};


/**
 * Função que verifica se um token JWT é válido e retorna suas informações decodificadas.
 */
const verify = (token:string): IJwtData | "JWT_SECRET_NOT_FOUND" | "INVALID_TOKEN" => {
    
    if (!process.env.JWT_SECRET) {
        return "JWT_SECRET_NOT_FOUND";
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (typeof decoded === "string") {
            return "INVALID_TOKEN";
        }
        return decoded as IJwtData;
        
    } catch (err) {
        return "INVALID_TOKEN";
    }

};


export const JWTService = {
    sign,
    verify,
};