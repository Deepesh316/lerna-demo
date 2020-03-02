import Logger from "@dkr/logger";
import { assign, get, keys } from "lodash";
import mongoUriBuilder from "mongo-uri-builder";
import { IMongooseModelOptions } from "./lib/cache.config";
import CacheConnector from "./lib/cacheConnector";
import ConectorInterface from "./lib/cacheConnector.interface";

const cacheConnectors: CacheConnector[] = [];
const DEFAULT_CONFIG: ConectorInterface = {
  username: get(process, "env.DB_USER"),
  password: get(process, "env.DB_PASS"),
  database: get(process, "env.DB_NAME"),
  port: get(process, "env.DB_PORT"),
  host: get(process, "env.DB_HOST")
};

const DbCache = {
  getInstance(
    configuration: ConectorInterface = {},
    modelOptions?: IMongooseModelOptions
  ): CacheConnector {
    const config = assign({}, DEFAULT_CONFIG, configuration);

    const configKeys = keys(config);
    configKeys.forEach((key: string) => {
      if (!config[key]) {
        Logger.error(
          `Missing config value for ${key} - received ${typeof config[key]} "${
            config[key]
          }"`
        );
      }
    });

    const mongoUri = mongoUriBuilder(config);
    Logger.debug("MongoDb connection string string: ", mongoUri);

    const cacheKey = modelOptions
      ? `${modelOptions.collection}_${mongoUri}`
      : mongoUri;

    cacheConnectors[cacheKey] =
      cacheConnectors[cacheKey] || new CacheConnector(mongoUri, modelOptions);

    return cacheConnectors[cacheKey];
  }
};

export { CacheConnector, DbCache, ConectorInterface, IMongooseModelOptions };
