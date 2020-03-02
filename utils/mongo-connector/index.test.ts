import { MongoMemoryServer } from "mongodb-memory-server";
import { DbConnector, IDBConnector } from "./index";

jest.setTimeout(10000);

const testConfig: IDBConnector = {
  username: "",
  password: "",
  host: "localhost",
  port: 0,
  database: ""
};

describe("MongoDbConnector", () => {
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = new MongoMemoryServer(); // Creating new instance
    testConfig.database = await mongod.getDbName(); // Get the DB-Name of the currently running Instance
    testConfig.port = await mongod.getPort(); // Get the Port of the currently running Instance
  });

  afterAll(async () => {
    if (mongod) {
      // Stop mongod instance after testing
      await mongod.stop();
    }
  });

  it("Returns MongoDB connection string when passing correct config", done => {
    const connector = DbConnector.getInstance(testConfig);
    connector.connect().then(check => {
      connector.disconnect().then(done);
    });
  });

  it("Returns the same DB Connector when passed a similar config file", () => {
    const connector1 = DbConnector.getInstance(testConfig);
    const connector2 = DbConnector.getInstance(testConfig);
    expect(connector1).toBe(connector2);
  });
});
