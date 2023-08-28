import buildProdLogger from "./prod-logger";
import buildDevLogger from "./dev-logger";
import { Logger } from "winston";

let logger: Logger; 
if (process.env.NODE_ENV === "production") {
    logger = buildProdLogger();
} else {
    logger = buildDevLogger();
}

export default logger;