const crypto = require("crypto");

const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;

const hashPartitionKey = (candidate) => {
  return crypto.createHash("sha3-512").update(candidate).digest("hex");
}

const getPartitionKeyFromEvent = (event) => {
  const partitionKey = typeof event.partitionKey !== "string" ? JSON.stringify(event.partitionKey) : event.partitionKey;
  if (partitionKey.length > MAX_PARTITION_KEY_LENGTH) {
    return hashPartitionKey(partitionKey);
  }
  return partitionKey;
}

exports.deterministicPartitionKey = (event) => {
  if (!event) {
    return TRIVIAL_PARTITION_KEY;
  }
  
  if (event.partitionKey) {
    return getPartitionKeyFromEvent(event);
  } else {
    const data = JSON.stringify(event);
    return hashPartitionKey(data);
  }
};