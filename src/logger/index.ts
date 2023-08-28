import {format, createLogger, transports} from "winston";

const logger =createLogger({
    level: "info",
    format:format.combine(
        format.colorize(),
        format.timestamp({ format: "YYY-MM-DD HH:mm:ss" }),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: "logs/app.log" }) // Criará logs dentro de uma pasta "logs"
    ]
});

module.exports = logger;