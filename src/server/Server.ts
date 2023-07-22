import "express-async-errors";
import express from "express";
import "dotenv/config";
import { router } from "./routes";
import { errorMiddleware } from "./shared/middleware";

const server = express();

server.use(express.json());
server.use(router);
server.use(errorMiddleware);

export { server }; 