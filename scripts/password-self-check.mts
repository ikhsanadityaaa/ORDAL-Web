import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { hashPassword, verifyPassword } from "../src/lib/password.ts";

const password = "ORDAL-test-password";
const knownHash =
  "scrypt$16384$8$1$000102030405060708090a0b0c0d0e0f$" +
  "085ee6eb3e72221a2475b0a8e69fa5f8cd7efe47864bf52b437cfc4752558f1" +
  "463962dd1b6156a2a75469ee72623395b0ee3b6f573b2aa2f61f0bdb8ff1516f0";

assert.deepEqual(await verifyPassword(password, knownHash), {
  valid: true,
  needsUpgrade: false,
});
assert.equal((await verifyPassword("wrong", knownHash)).valid, false);

const legacySha = createHash("sha256").update(password).digest("hex");
assert.deepEqual(await verifyPassword(password, legacySha), {
  valid: true,
  needsUpgrade: true,
});

const generated = await hashPassword(password);
assert.match(generated, /^scrypt\$16384\$8\$1\$/);
assert.equal((await verifyPassword(password, generated)).valid, true);

console.log("password compatibility self-check passed");
