import CacheManagerMongoose from "cache-manager-mongoose";
import Mongoose from "mongoose";

/**
 * Ref - https://mongoosejs.com/docs/guide.html#read
 */
export enum MongooseReadPreference {
  PRIMARY = "primary",
  PRIMARY_PREFERRED = "primaryPreferred",
  SECONDARY = "secondary",
  SECONDARY_PREFERRED = "secondaryPreferred",
  NEARESR = "nearest"
}

export interface IMongooseModelOptions {
  collection: string; // mongo collection name
  versionKey?: boolean;
  read?: MongooseReadPreference;
}

export interface IMongoReplica {
  host: string;
  port?: number;
}

export interface IMongoConfig {
  store: any;
  mongoose: any;
  ttl: number;
  modelOptions?: IMongooseModelOptions;
}

export const getMongooseConfig = (
  modelOptions?: IMongooseModelOptions
): IMongoConfig => ({
  store: CacheManagerMongoose,
  mongoose: Mongoose,
  ttl: 180 * 24 * 60 * 60, // this value wil not be used and will be picked from options passed  while setting key
  modelOptions
});
