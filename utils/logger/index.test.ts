import Logger from "./index";

describe("Logger", () => {
  it("Has trace method", () => {
    expect(() => {
      Logger.trace("trace");
    }).not.toThrow();
  });
  it("Has debug method", () => {
    expect(() => {
      Logger.debug("debug");
    }).not.toThrow();
  });
  it("Has info method", () => {
    expect(() => {
      Logger.info("info");
    }).not.toThrow();
  });
  it("Has warn method", () => {
    expect(() => {
      Logger.warn("warn");
    }).not.toThrow();
  });
  it("Has error method", () => {
    expect(() => {
      Logger.error("error");
    }).not.toThrow();
  });
  it("Has fatal method", () => {
    expect(() => {
      Logger.fatal("fatal");
    }).not.toThrow();
  });
  it("Has audit method", () => {
    expect(() => {
      Logger.audit("audit");
    }).not.toThrow();
  });
});
