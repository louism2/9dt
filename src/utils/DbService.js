import fs from "fs";
import Sequelize from "sequelize";

// Utility class to connect to the Postgres DB using Sequelize.
//
// The single connection instance creates a connection pool under
// the covers so we can reuse the same connection
class DbService {

    static connection;

    static getSequelizeConnection () {
        if (!this.connection) {
            const envConfig = this.getEnvConfig();
            this.connection = new Sequelize(envConfig);
        }

        return this.connection
    }

    static getEnvConfig () {
        const rawConfig = fs.readFileSync("./config/config.json");
        const configJSON = JSON.parse(rawConfig);

        const env = process.env.NODE_ENV;
        const envConfig = configJSON[env];
        if (!envConfig) {
            throw("No database config found for the current environment: " + env);
        }

        return envConfig;
    }
}

export default DbService;