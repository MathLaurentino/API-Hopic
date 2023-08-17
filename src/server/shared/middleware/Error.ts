import { NextFunction, Request, Response } from "express";
import { ApiError, removeImageFromFileSystem } from "../services";


export const errorMiddleware = (error: Error & Partial<ApiError>, req: Request, res: Response, next: NextFunction) => {

    if (req.file) {
        removeImageFromFileSystem(req.file.filename);
    }
    
    const statusCode = error.statusCode ?? 500;
    const message = error.statusCode ? error.message : "Internal Server Error";

    return res.status(statusCode).json({
        errors: {
            default: message
        }
    });

};