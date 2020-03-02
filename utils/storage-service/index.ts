import Logger from "../logger/index";
import { CacheConnector, DbCache } from "../dbcache/index";
import { get } from "lodash";
import { v4 as uuidV4 } from "uuid";

const APP_TTL = get(process, "env.APP_TTL", 30 * 60);

class StorageService {
  private dbCacheInstance: CacheConnector;
  constructor() {
    // const dbConnectionDetails = {
    //   username: get(process, "env.DB_USER_NAME"),
    //   password: get(process, "env.DB_PASSWORD"),
    //   host: get(process, "env.DB_HOST"),
    //   port: 27017,
    //   database: get(process, "env.DB_NAME")
    // };

    this.dbCacheInstance = DbCache.getInstance();
    this.dbCacheInstance.connect();
  }

  /**
   * Store data without valid session
   * data: app input
   * appId: application Id
   * ukey: unique key
   */
  public storeData = (data: any, appId: string, ukey?: string) => {
    const key = ukey ? ukey : uuidV4();
    return this.dbCacheInstance
      .set(key, data, () => APP_TTL)
      .then(() => {
        Logger.info(`Return Key : ${key} `);
        return key;
      })
      .catch(err => {
        console.log("Error", err.message);
        Logger.error(err);
        throw err;
        // throw new Error("Error in setting cache");
      });
  };
}

export default StorageService;
