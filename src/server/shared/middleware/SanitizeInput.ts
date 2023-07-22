import { NextFunction, Request, Response } from "express";

// Middleware para remoção de caracteres indesejados
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {

    if (req.body) {
        for (const key in req.body) {
            if (typeof req.body[key] === "string") {
            
                let sanitizedString = req.body[key].replace(/[^\w\sÀ-ú]/giu, "");
                sanitizedString = sanitizedString.trim();

                req.body[key] = sanitizedString;
            }
        }
    }

    next();

};