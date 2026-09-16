import {
  createHash,
  randomBytes,
  scrypt,
  timingSafeEqual,
} from "crypto";

const SCRYPT_COST = 16_384;
const SCRYPT_BLOCK_SIZE = 8;
const SCRYPT_PARALLELIZATION = 1;
const SCRYPT_KEY_LENGTH = 64;

function deriveKey(
  password: string,
  salt: Buffer,
  cost: number,
  blockSize: number,
  parallelization: number,
  keyLength: number
) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(
      password,
      salt,
      keyLength,
      {
        N: cost,
        r: blockSize,
        p: parallelization,
        maxmem: 64 * 1024 * 1024,
      },
      (error, key) => (error ? reject(error) : resolve(key))
    );
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await deriveKey(
    password,
    salt,
    SCRYPT_COST,
    SCRYPT_BLOCK_SIZE,
    SCRYPT_PARALLELIZATION,
    SCRYPT_KEY_LENGTH
  );

  return [
    "scrypt",
    SCRYPT_COST,
    SCRYPT_BLOCK_SIZE,
    SCRYPT_PARALLELIZATION,
    salt.toString("hex"),
    key.toString("hex"),
  ].join("$");
}

export async function verifyPassword(password: string, stored: string) {
  if (stored.startsWith("scrypt$")) {
    const [algorithm, costValue, blockSizeValue, parallelValue, saltHex, keyHex] =
      stored.split("$");
    const cost = Number(costValue);
    const blockSize = Number(blockSizeValue);
    const parallelization = Number(parallelValue);

    if (
      algorithm !== "scrypt" ||
      cost !== SCRYPT_COST ||
      blockSize !== SCRYPT_BLOCK_SIZE ||
      parallelization !== SCRYPT_PARALLELIZATION ||
      !/^[a-f0-9]{32}$/i.test(saltHex ?? "") ||
      !/^[a-f0-9]{128}$/i.test(keyHex ?? "")
    ) {
      return { valid: false, needsUpgrade: false };
    }

    const expected = Buffer.from(keyHex, "hex");
    const actual = await deriveKey(
      password,
      Buffer.from(saltHex, "hex"),
      cost,
      blockSize,
      parallelization,
      expected.length
    );

    return {
      valid: timingSafeEqual(actual, expected),
      needsUpgrade: false,
    };
  }

  // Existing ORDAL-Web accounts used an unsalted SHA-256 hash.
  if (/^[a-f0-9]{64}$/i.test(stored)) {
    const actual = Buffer.from(
      createHash("sha256").update(password).digest("hex"),
      "hex"
    );
    const expected = Buffer.from(stored, "hex");
    const valid = timingSafeEqual(actual, expected);
    return { valid, needsUpgrade: valid };
  }

  return { valid: false, needsUpgrade: false };
}
