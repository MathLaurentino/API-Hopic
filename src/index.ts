import { Knex } from "./server/database/knex";
import { server } from "./server/Server";
import logger from "./server/shared/services/logger";


const startServer = () => {
    server.listen(process.env.PORT || 3333, () => {
        logger.info(`Server is running on port ${process.env.PORT || 3333}`);
    });
};


/**
 * Se estiver rodando localmente, inicializa as migrates
 *  antes de inicializar o servidor com o startServer()
 */
if (process.env.IS_LOCALHOST !== "true") {
    Knex.migrate.latest()
        .then(() => {
            startServer();
        })
        .catch(console.log); 
} else {
    startServer();
}