import logger from "../../utils/logger";
import StorageService from "../../utils/storage-service/index";
require("dotenv").config({ path: ".env" }); // for env variables

class CacheStore {
  private store: StorageService;
  constructor() {
    this.store = new StorageService();
  }

  public updateData = async (req: any, res: any, next) => {
    try {
      if (Object.keys(req.body).length === 0 || !req.query.appId) {
        logger.error("AppId and Data is required", { operation: "updateData" });
        next(new Error("AppId and Data is required"));
      }

      const appId = req.query.appId;
      const cookieValue = `${appId}-params`;

      if (!req.cookies[cookieValue]) {
        logger.info("Cookie not present");
        const id = req.query.id ? req.query.id : undefined;
        const uid = await this.getUniqueId(req.body, appId, id);
        const cookieString = JSON.stringify({
          key: uid,
          appId: appId
        });

        res.cookie(cookieValue, cookieString);
        return res.send(uid);
      }

      const cookieParse = JSON.parse(req.cookies[cookieValue]);
      const cookieKey = cookieParse.key;

      const uid = await this.getUniqueId(req.body, appId, cookieKey);
      return res.send(uid);
    } catch (error) {
      next(error);
    }
  };

  private getUniqueId = async (
    data: any,
    appId: string,
    ukey?: string
  ): Promise<any> => {
    try {
      const uniqueId = await this.store.storeData(data, appId, ukey);
      return uniqueId;
    } catch (error) {
      throw error;
    }
  };
}

export default new CacheStore();
