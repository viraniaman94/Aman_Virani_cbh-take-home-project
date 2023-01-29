const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("should return the partitionKey property of the event if it exists", () => {
    const event = { partitionKey: "testKey" };
    const result = deterministicPartitionKey(event);
    expect(result).toBe("testKey");
  });

  it("should return a SHA3-512 hash of the event if partitionKey does not exist", () => {
    const event = { test: "data" };
    const result = deterministicPartitionKey(event);
    expect(result.length).toBe(128);
  });

  it("should return a hash if the candidate is longer than MAX_PARTITION_KEY_LENGTH", () => {
    const longKey = "x".repeat(257);
    const event = { partitionKey: longKey };
    const result = deterministicPartitionKey(event);
    expect(result.length).toBe(128);
  });

  it("should return a string if the candidate is not a string", () => {
    const event = { partitionKey: { key: "value" } };
    const result = deterministicPartitionKey(event);
    expect(typeof result).toBe("string");
  });
});
