import Logger from "@dkr/logger";
import MongoClient from "mongodb";

const CONNECTION_UNAVAILABLE = "DB connection unavailable";

class MongoConnector {
  private connection: Promise<MongoClient.MongoClient> | null = null;
  private mongoUri: string;
  private db: MongoClient.Db | null = null;
  private client: MongoClient.MongoClient | null = null;
  constructor(connectionString: string) {
    this.mongoUri = connectionString;
  }

  /**
   * Checking for connection
   */
  public connect(): Promise<MongoClient.MongoClient> {
    // Avoid repetitive connection
    if (this.connection) {
      return this.connection;
    }
    return (this.connection = this.createConnection());
  }

  /**
   * Disconnect MongoDb instance
   */
  public disconnect(): Promise<any> {
    let prom: any = Promise.resolve();
    if (this.client && this.connection) {
      prom = this.client.close();
      this.db = null;
      this.client = null;
      this.connection = null;
    }
    return prom;
  }

  /**
   * Create MongoDb connection
   */
  public createConnection(): Promise<any> {
    return MongoClient.connect(this.mongoUri, { useNewUrlParser: true })
      .then(client => {
        Logger.info("Successfully connected to MongoDb.");
        this.client = client;
        this.db = client.db();
        return client;
      })
      .catch(err => {
        Logger.error(
          "db-connector: DB connection failed, retrying in 1s",
          this.mongoUri,
          err
        );
        return new Promise(resolve => {
          setTimeout(() => {
            Logger.error("db-connector: Trying to connect", this.mongoUri, err);
            return resolve(this.createConnection());
          }, 1 * 1000);
        });
      });
  }

  /**
   * FindOne Method
   * @param collectionName
   * @param filter
   * @param options
   */
  public findOne(
    collectionName: string,
    filter: MongoClient.FilterQuery<any>,
    options?: MongoClient.FindOneOptions
  ) {
    return this.connect().then(() => {
      if (!this.db) {
        throw new Error(CONNECTION_UNAVAILABLE);
      }
      return this.db.collection(collectionName).findOne(filter, options);
    });
  }

  /**
   * Find Method
   * @param collectionName
   * @param document
   */
  public find(
    collectionName: string,
    query: MongoClient.FilterQuery<any>,
    options?: MongoClient.FindOneOptions
  ): Promise<any> {
    return this.connect().then(() => {
      if (!this.db) {
        throw new Error(CONNECTION_UNAVAILABLE);
      }
      return this.db
        .collection(collectionName)
        .find(query, options)
        .toArray();
    });
  }

  public findOneAndUpdate(
    collectionName: string,
    filter: MongoClient.FilterQuery<any>,
    update: MongoClient.UpdateQuery<any>,
    options?: MongoClient.FindOneAndUpdateOption
  ): Promise<MongoClient.FindAndModifyWriteOpResultObject<any>> {
    return this.connect().then(() => {
      if (!this.db) {
        throw new Error(CONNECTION_UNAVAILABLE);
      }
      return this.db
        .collection(collectionName)
        .findOneAndUpdate(filter, update, options);
    });
  }

  /**
   * Insert Method
   */
  public insert(
    collectionName: string,
    document: any
  ): Promise<MongoClient.InsertOneWriteOpResult<any>> {
    return this.connect().then(() => {
      if (!this.db) {
        throw new Error(CONNECTION_UNAVAILABLE);
      }
      return this.db.collection(collectionName).insertOne(document);
    });
  }

  /**
   * InsertMany Method
   * @param collectionName
   * @param documents
   * @param options
   */
  public insertMany(
    collectionName: string,
    documents: Array<object>,
    options?: object
  ): Promise<MongoClient.InsertWriteOpResult<any>> {
    return this.connect().then(() => {
      if (!this.db) {
        throw new Error(CONNECTION_UNAVAILABLE);
      }
      return this.db.collection(collectionName).insertMany(documents, options);
    });
  }

  /**
   * UpdateMany Method
   * @param collectionName
   * @param filter
   * @param update
   * @param options
   */
  public updateMany(
    collectionName: string,
    filter: MongoClient.FilterQuery<any>,
    update: MongoClient.UpdateQuery<any> | Partial<any>,
    options?: MongoClient.UpdateManyOptions
  ): Promise<MongoClient.UpdateWriteOpResult> {
    return this.connect().then(() => {
      if (!this.db) {
        throw new Error(CONNECTION_UNAVAILABLE);
      }
      return this.db
        .collection(collectionName)
        .updateMany(filter, update, options);
    });
  }

  /**
   * Update Method
   * @param collectionName
   * @param filter
   * @param update
   * @param options
   */
  public update(
    collectionName: string,
    filter: MongoClient.FilterQuery<any>,
    update: MongoClient.UpdateQuery<any> | Partial<any>,
    options?: MongoClient.UpdateOneOptions
  ): Promise<MongoClient.WriteOpResult> {
    return this.connect().then(() => {
      if (!this.db) {
        throw new Error(CONNECTION_UNAVAILABLE);
      }
      return this.db.collection(collectionName).update(filter, update, options);
    });
  }
}

export default MongoConnector;
