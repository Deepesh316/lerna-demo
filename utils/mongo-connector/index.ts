import Logger from "@dkr/logger";
import mongoUriBuilder from "mongo-uri-builder";
import { get, assign, keys } from "lodash";
import IDBConnector from "./lib/dbConfig.interface";
import MongoConnector from "./lib/mongoConnector";
require("dotenv").config({ path: ".env" }); // for env variables

const connectors: MongoConnector[] = [];
const DEFAULT_CONFIG: IDBConnector = {
  username: get(process, "env.USER_NAME"),
  password: get(process, "env.PASSWORD"),
  host: get(process, "env.HOST"),
  port: get(process, "env.PORT"),
  database: get(process, "env.DB_NAME")
};

const DbConnector = {
  getInstance(configuration: IDBConnector = {}): MongoConnector {
    const dbConfig: IDBConnector = assign({}, DEFAULT_CONFIG, configuration);
    const configurationKeys = keys(dbConfig); // [key1, key2, key3]

    configurationKeys.forEach((key: string) => {
      if (!dbConfig[key]) {
        Logger.error(`Missing config value for ${key}`);
      }
    });

    const connectionString = mongoUriBuilder(dbConfig);
    Logger.debug("MongoDb connection string: ", connectionString);

    connectors[connectionString] =
      connectors[connectionString] || new MongoConnector(connectionString);

    return connectors[connectionString];
  }
};

export { DbConnector, IDBConnector, MongoConnector };
