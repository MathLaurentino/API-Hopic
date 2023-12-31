import { NextFunction, Request, Response } from "express";
import { ApiError, removeImageFromFileSystem } from "../services";
import logger from "../services/logger";

export const errorMiddleware = (error: Error & Partial<ApiError>, req: Request, res: Response, next: NextFunction) => {

    if (req.file) {
        removeImageFromFileSystem(req.file.filename);
    }

    const statusCode = error.statusCode ?? 500;
    const message = statusCode == 500 ? "Internal Server Error" : error.message;

    if (statusCode === 500) {
        logger.error(error.message);
    }

    return res.status(statusCode).json({
        errors: {
            default: message
        }
    });

};