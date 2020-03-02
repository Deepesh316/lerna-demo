import { MongoMemoryServer } from "mongodb-memory-server";
import MongoConnector from "./mongoConnector";

const COLLECTION_NAME = "mockCollection";
jest.setTimeout(10000);

describe("MongoDb connector", () => {
  let mongod: MongoMemoryServer;
  let URI: string;
  let connector;

  beforeAll(async () => {
    mongod = new MongoMemoryServer();
    URI = await mongod.getConnectionString();
    connector = new MongoConnector(URI);
  });

  afterAll(async () => {
    if (mongod) {
      // Stop mongod instance after testing
      await mongod.stop();
    }
  });

  it("inserts & findOne", done => {
    const data = { item: "findOne" };
    const data1 = { item: "findOnee" };
    connector.insert(COLLECTION_NAME, data).then(() => {
      connector.findOne(COLLECTION_NAME, data).then((rsp: any) => {
        expect(rsp).toEqual(data1);
        done();
      });
    });
  });
});
