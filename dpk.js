const crypto = require("crypto");

exports.deterministicPartitionKey = (event) => {
	const TRIVIAL_PARTITION_KEY = "0";

	if (!event) {
		return TRIVIAL_PARTITION_KEY;
	}

	const MAX_PARTITION_KEY_LENGTH = 256;

	const hash = crypto.createHash("sha3-512");

	if (event.partitionKey) {
		let keyString =
			typeof event.partitionKey === "string"
				? event.partitionKey
				: JSON.stringify(event.partitionKey);
		if (keyString.length > MAX_PARTITION_KEY_LENGTH) {
			return hash.update(keyString).digest("hex");
		} else {
			return keyString;
		}
	}

	return hash.update(JSON.stringify(event)).digest("hex");
};
