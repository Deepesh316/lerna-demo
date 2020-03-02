import { DbCache } from "../dbcache/index";
import { v4 as uuidV4 } from "uuid";
import StorageService from "../storage-service/index";

jest.mock("uuid");

const MockCacheConnector = {
  connect() {
    return MockCacheConnector;
  },
  set() {
    return Promise.resolve({});
  }
} as any;

describe("Storage Service", () => {
  beforeAll(() => {
    jest.spyOn(DbCache, "getInstance").mockImplementation(() => {
      return MockCacheConnector;
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("mock uuid", () => {
    it("Should create instance", () => {
      expect(() => {
        // tslint:disable-next-line: no-unused-expression
        new StorageService();
      }).not.toThrow();
    });

    it("should return testid ", () => {
      uuidV4.mockImplementation(() => "32e67d31-6d46-45c2-927e-da09587d6be2");
    });
  });

  it("Should set data in cache if uid is paased", async () => {
    const ss = new StorageService();
    const data = await ss.storeData({}, "RLS", "1234566");
    expect(data).toBe("1234566");
  });

  it("Should set data in cache if uid is not passed", async () => {
    const ss = new StorageService();

    const data = await ss.storeData({}, "RLS");
    expect(data).toBe("32e67d31-6d46-45c2-927e-da09587d6be2");
  });
});

describe("Storage Service", () => {
  const MockCacheConnector1 = {
    connect() {
      return MockCacheConnector1;
    },
    set() {
      return Promise.reject(new Error("Error in setting cache"));
    }
  } as any;
  beforeAll(() => {
    jest.spyOn(DbCache, "getInstance").mockImplementation(() => {
      return MockCacheConnector1;
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("Should throw error if cache is not set properly", async done => {
    const ss = new StorageService();
    await ss.storeData({}, "RLS", "1234566").catch(e => {
      expect(e.message).toEqual("Error in setting cache");
      done();
    });
  });
});
