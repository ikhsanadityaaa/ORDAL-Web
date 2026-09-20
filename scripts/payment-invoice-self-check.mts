import assert from "node:assert/strict";
import { ORIGINAL_PRICE_IDR, PRICE_IDR, PRICE_USD, paymentInvoiceContent } from "../src/lib/payment-invoice.ts";

assert.equal(ORIGINAL_PRICE_IDR, 210000);
assert.equal(PRICE_IDR, 179000);
assert.equal(PRICE_USD.toFixed(2), "12.00");

const invoice = paymentInvoiceContent({
  id: "PAY-TEST", name: "Test User", email: "test@example.com", method: "qris_bca",
  currency: "IDR", amount: PRICE_IDR, amountUsd: null,
  paidAt: new Date("2026-09-18T00:00:00Z"), activationCode: "ORD-TEST-CODE-1234",
});
assert.match(invoice.html, /Rp210\.000/);
assert.match(invoice.html, /Rp179\.000/);
assert.match(invoice.html, /ORD-TEST-CODE-1234/);
assert.match(invoice.text, /Status: PAID/);

console.log("Payment invoice self-check passed");
