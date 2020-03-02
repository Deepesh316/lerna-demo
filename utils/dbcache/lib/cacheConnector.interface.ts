import { IMongoReplica } from "./cache.config";

export default interface IMongoConnector {
  username?: string;
  password?: string;
  database?: string;
  host?: string;
  port?: number;
  replicas?: IMongoReplica[];
  options?: any;
}
