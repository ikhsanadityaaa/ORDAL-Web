import assert from "node:assert/strict";

const base = process.env.ORDAL_TEST_API_BASE_URL?.replace(/\/$/, "");
const token = process.env.ORDAL_TEST_APP_TOKEN;
const raceEmail = process.env.ORDAL_TEST_RACE_EMAIL;

if (!base) throw new Error("Set ORDAL_TEST_API_BASE_URL to an isolated Preview deployment");
if (!base.includes("vercel.app") && process.env.ORDAL_ALLOW_NON_PREVIEW_TEST !== "true") {
  throw new Error("Refusing non-preview target. Set ORDAL_ALLOW_NON_PREVIEW_TEST=true only for an isolated test environment");
}

async function json(path: string, init: RequestInit = {}) {
  const response = await fetch(`${base}${path}`, init);
  const body = await response.json().catch(() => ({}));
  return { response, body };
}

const config = await json("/api/app/auth/google/config");
assert.equal(config.response.status, 200);
assert.equal(typeof config.body.configured, "boolean");

if (raceEmail) {
  const payload = {
    name: "ORDAL Race Check",
    email: raceEmail,
    password: `Check-${crypto.randomUUID()}-9a`,
    device_fingerprint: `race-${crypto.randomUUID()}`,
    device_name: "Preview integration check",
    os: "test",
    app_version: "integration",
  };
  const attempts = await Promise.all(
    Array.from({ length: 4 }, () => json("/api/app/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    })),
  );
  const created = attempts.filter(({ response }) => response.status === 200);
  assert.equal(created.length, 1, `expected one registration, got statuses ${attempts.map((x) => x.response.status).join(",")}`);
  assert.ok(attempts.every(({ response }) => [200, 409, 429].includes(response.status)));
}

if (token) {
  const auth = { authorization: `Bearer ${token}` };
  const me = await json("/api/app/auth/me", { headers: auth });
  assert.equal(me.response.status, 200);

  const trials = await Promise.all(
    Array.from({ length: 4 }, () => json("/api/app/trial/start", { method: "POST", headers: auth })),
  );
  assert.ok(trials.every(({ response }) => [200, 403].includes(response.status)));
  const successfulTrials = trials.filter(({ response }) => response.status === 200);
  if (successfulTrials.length) {
    assert.ok(successfulTrials.filter(({ body }) => body.just_started === true).length <= 1);
  }

  const payments = await Promise.all(
    Array.from({ length: 3 }, () => json("/api/app/payments/create", {
      method: "POST",
      headers: { ...auth, "content-type": "application/json" },
      body: JSON.stringify({ method: "qris_bca" }),
    })),
  );
  const accepted = payments.filter(({ response }) => response.status === 200);
  if (accepted.length) {
    const ids = new Set(accepted.map(({ body }) => body.id));
    assert.equal(ids.size, 1, "concurrent payment creation must reuse one pending invoice");
    const paymentId = accepted[0].body.id;
    const checks = await Promise.all(
      Array.from({ length: 4 }, () => json(`/api/app/payments/${paymentId}/check`, { method: "POST", headers: auth })),
    );
    assert.ok(checks.every(({ response }) => response.status === 200));
    assert.equal(new Set(checks.map(({ body }) => `${body.id}:${body.status}`)).size, 1);
  } else {
    assert.ok(payments.every(({ response }) => [409, 503].includes(response.status)));
  }
}

console.log("Preview integration checks passed");
