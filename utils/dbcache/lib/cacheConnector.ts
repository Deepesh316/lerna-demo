import Logger from "@dkr/logger";
import CacheManager from "cache-manager";
import Mongoose from "mongoose";
import { getMongooseConfig, IMongooseModelOptions } from "./cache.config";

const DEFAULT_MONGOOSE_TTL = getMongooseConfig().ttl;

const getTtl = (data, store): number => {
  return DEFAULT_MONGOOSE_TTL;
};

class CacheConnector {
  private mongoUri: string;
  private cache: any;
  private modelOptions: IMongooseModelOptions | undefined;

  constructor(mongoUri: string, modelOptions?: IMongooseModelOptions) {
    this.mongoUri = mongoUri;
    this.modelOptions = modelOptions;
  }

  public connect(): void {
    // 1 === connected && 2 === connecting
    if (
      Mongoose.connection.readyState === 1 ||
      Mongoose.connection.readyState === 2
    ) {
      Logger.info("db-cache: Already connected or connecting");
      return;
    }

    this.createConnection();
    this.createCache();
  }

  public set(key: string, value: any, ttl = getTtl): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.cache.set(key, value, { ttl }, err => {
        if (err) {
          Logger.warn(
            `CacheConnector: error setting cache entry: ${key}: ${JSON.stringify(
              value
            )}`
          );
          reject(err);
        } else {
          Logger.warn(
            `CacheConnector: set cache entry: ${key}: ${JSON.stringify(value)}`
          );
          resolve(true);
        }
      });
    });
  }

  public get(key) {
    return this.cache.get(key);
  }

  public del(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cache.del(key, err => {
        if (err) {
          Logger.warn(`CacheConnector: error deleting cache entry: ${key}`);
          reject(err);
        } else {
          Logger.warn(`CacheConnector: deleted entry: ${key}`);
          resolve();
        }
      });
    });
  }

  private createConnection() {
    return Mongoose.connect(this.mongoUri, {
      keepAlive: true,
      useNewUrlParser: true
    })
      .then(() => {
        Logger.info("db-cache: Connected");
      })
      .catch(err => {
        Logger.error(
          "db-cache: connection failed, retrying in 1s",
          this.mongoUri,
          err
        );
        return new Promise(resolve => {
          setTimeout(() => {
            Logger.error("db-connector: Trying to connect", this.mongoUri, err);
            resolve(this.createConnection());
          }, 1 * 1000);
        });
      });
  }

  private createCache() {
    const caches: any[] = [];

    caches.push(this.createMongooseCache());

    this.cache = CacheManager.multiCaching(caches);
  }

  private createMongooseCache() {
    return CacheManager.caching(getMongooseConfig(this.modelOptions));
  }
}

export default CacheConnector;
