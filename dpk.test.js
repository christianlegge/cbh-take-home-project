const { deterministicPartitionKey } = require("./dpk");
const crypto = require("crypto");

describe("deterministicPartitionKey", () => {
	it("Returns the literal '0' when given no input", () => {
		const trivialKey = deterministicPartitionKey();
		expect(trivialKey).toBe("0");
	});

	it("Returns the literal '0' when given falsy input", () => {
		const trivialKey = deterministicPartitionKey(false);
		expect(trivialKey).toBe("0");
	});

	it("Returns the sha3-512 digest of the input when given an input with a partitionKey key with a falsy value", () => {
		// possible bug in the original code due to checking for existence !== checking for truthiness
		const key = deterministicPartitionKey({ partitionKey: false });
		expect(key).toBe(
			crypto
				.createHash("sha3-512")
				.update(JSON.stringify({ partitionKey: false }))
				.digest("hex")
		);
	});

	it("Returns the given string if input is an object with a partitionKey key and a string value", () => {
		const keyValue = "myKey";
		const key = deterministicPartitionKey({ partitionKey: keyValue });
		expect(key).toBe(keyValue);
	});

	it("Returns the sha3-512 digest of the given string if input is an object with a partitionKey key and a string value which is over 256 chars", () => {
		const keyValue =
			"REALLY LONG KEY REALLY LONG KEY REALLY LONG KEY REALLY LONG KEY REALLY LONG KEY REALLY LONG KEY REALLY LONG KEY REALLY LONG KEY REALLY LONG KEY REALLY LONG KEY REALLY LONG KEY REALLY LONG KEY REALLY LONG KEY REALLY LONG KEY REALLY LONG KEY REALLY LONG KEY REALLY LONG KEY REALLY LONG KEY REALLY LONG KEY REALLY LONG KEY ";
		const key = deterministicPartitionKey({ partitionKey: keyValue });
		expect(key).toBe(
			crypto.createHash("sha3-512").update(keyValue).digest("hex")
		);
	});

	it("Returns the stringified object if input is an object with a partitionKey key and a non-string value", () => {
		const objectValue = { a: 1, b: 2 };
		const numberValue = 65536;
		const arrayValue = [0, 1, 2];
		const objectKey = deterministicPartitionKey({
			partitionKey: objectValue,
		});
		const numberKey = deterministicPartitionKey({
			partitionKey: numberValue,
		});
		const arrayKey = deterministicPartitionKey({
			partitionKey: arrayValue,
		});
		expect(objectKey).toBe(JSON.stringify(objectValue));
		expect(numberKey).toBe(JSON.stringify(numberValue));
		expect(arrayKey).toBe(JSON.stringify(arrayValue));
	});

	it("Returns the sha3-512 hash of the stringified input", () => {
		const secret = "mySecret";
		const secretObj = { secret: "mySecret" };
		const secretNumber = 65536;
		const secretArray = [0, 1, 2];
		const key = deterministicPartitionKey(secret);
		const objKey = deterministicPartitionKey(secretObj);
		const numberKey = deterministicPartitionKey(secretNumber);
		const arrayKey = deterministicPartitionKey(secretArray);
		expect(key).toBe(
			crypto
				.createHash("sha3-512")
				.update(JSON.stringify(secret))
				.digest("hex")
		);
		expect(objKey).toBe(
			crypto
				.createHash("sha3-512")
				.update(JSON.stringify(secretObj))
				.digest("hex")
		);
		expect(numberKey).toBe(
			crypto
				.createHash("sha3-512")
				.update(JSON.stringify(secretNumber))
				.digest("hex")
		);
		expect(arrayKey).toBe(
			crypto
				.createHash("sha3-512")
				.update(JSON.stringify(secretArray))
				.digest("hex")
		);
	});
});
