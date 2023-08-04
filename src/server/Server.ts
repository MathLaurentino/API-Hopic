import "express-async-errors";
import express from "express";
import "dotenv/config";
import cors from "cors";
import { router } from "./routes";
import { errorMiddleware } from "./shared/middleware";

const server = express();

server.use(cors({
    origin: process.env.ENABLED_CORS?.split(";") || []
}));

server.use(express.json());
server.use(router);
server.use(errorMiddleware);

export { server }; 