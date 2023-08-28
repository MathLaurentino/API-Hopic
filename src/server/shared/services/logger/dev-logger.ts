import {format, createLogger, transports} from "winston";
const { printf } = format;

const buildDevLogger = () => {

    const logFormat = printf(({ level, message, timestamp}) => {
        return `${timestamp} ${level}: ${message}`;
    });

    return createLogger({
        level: "info",
        format:format.combine(
            format.colorize(),
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            format.errors({ stack: true }),
            logFormat
        ),
        transports: [
            new transports.Console(),
        ]
    });

};

export default buildDevLogger;