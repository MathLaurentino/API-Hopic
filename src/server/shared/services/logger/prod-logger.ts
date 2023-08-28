import {format, createLogger, transports} from "winston";

const buildProdLogger = () => {

    return createLogger({
        level: "info",
        format:format.combine(
            format.timestamp(),
            format.errors({ stack: true }),
            format.json()
        ),
        transports: [
            new transports.Console(),
        ]
    });

};

export default buildProdLogger;