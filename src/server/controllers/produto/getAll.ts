import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ProdutoProvider } from "../../database/providers/produtos";

export const getAll = async (req: Request, res: Response): Promise<Response> => {

    const user_id = Number(req.headers.user_id);

    const result = await ProdutoProvider.getAll(user_id);

    return res.status(StatusCodes.OK).json(result);
};
