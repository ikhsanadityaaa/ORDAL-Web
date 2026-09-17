import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { AppApiError, ensureLicense } from "@/lib/app-api";
import { appUrl } from "@/lib/app-url";

export const PRICE_IDR = 159000;
export const PRICE_USD = new Prisma.Decimal("10.00");
const INVOICE_MS = 60 * 60 * 1000;

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new AppApiError(503, "PAYMENT_NOT_CONFIGURED", `${name} belum dikonfigurasi`);
  return value;
}

function paymentId() {
  return `PAY-${randomBytes(6).toString("hex").toUpperCase()}`;
}

function midtransBase() {
  return process.env.MIDTRANS_PRODUCTION === "true" ? "https://api.midtrans.com" : "https://api.sandbox.midtrans.com";
}

function paypalBase() {
  return process.env.PAYPAL_PRODUCTION === "true" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}

async function paypalToken() {
  const auth = Buffer.from(`${required("PAYPAL_CLIENT_ID")}:${required("PAYPAL_CLIENT_SECRET")}`).toString("base64");
  const response = await fetch(`${paypalBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "content-type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  if (!response.ok) throw new AppApiError(502, "PAYPAL_ERROR", "PayPal tidak dapat dihubungi");
  return (await response.json() as { access_token: string }).access_token;
}

export async function createPayment(userId: string, method: string) {
  if (!['qris_bca', 'paypal'].includes(method)) throw new AppApiError(400, "INVALID_PAYMENT_METHOD", "Metode pembayaran tidak valid");
  const existing = await db.payment.findFirst({
    where: { userId, method, status: "pending", expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (existing) return existing;
  const recentCount = await db.payment.count({
    where: { userId, createdAt: { gt: new Date(Date.now() - 60 * 60 * 1000) } },
  });
  if (recentCount >= 5) throw new AppApiError(429, "PAYMENT_RATE_LIMIT", "Terlalu banyak invoice. Coba lagi nanti");
  const id = paymentId();
  const expiresAt = new Date(Date.now() + INVOICE_MS);

  if (method === "qris_bca") {
    const serverKey = required("MIDTRANS_SERVER_KEY");
    const response = await fetch(`${midtransBase()}/v2/charge`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        payment_type: "qris",
        transaction_details: { order_id: id, gross_amount: PRICE_IDR },
        qris: { acquirer: "gopay" },
      }),
    });
    const data = await response.json() as { status_code?: string; status_message?: string; actions?: Array<{ name: string; url: string }>; qr_string?: string; transaction_id?: string };
    if (!response.ok || data.status_code !== "201") throw new AppApiError(502, "MIDTRANS_ERROR", data.status_message || "QRIS gagal dibuat");
    const qrUrl = data.actions?.find((action) => action.name === "generate-qr-code")?.url || null;
    return db.payment.create({
      data: {
        id, userId, method, amount: PRICE_IDR, baseAmount: PRICE_IDR, currency: "IDR",
        reference: id, gateway: "midtrans", gatewayRef: data.transaction_id || id,
        qrString: data.qr_string || null, qrUrl, expiresAt,
      },
    });
  }

  const token = await paypalToken();
  const response = await fetch(`${paypalBase()}/v2/checkout/orders`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "content-type": "application/json", "PayPal-Request-Id": id },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{ reference_id: id, custom_id: userId, amount: { currency_code: "USD", value: PRICE_USD.toFixed(2) } }],
      payment_source: { paypal: { experience_context: { return_url: `${appUrl()}/api/app/payments/paypal/return?payment=${id}`, cancel_url: `${appUrl()}/api/app/payments/paypal/return?payment=${id}&cancel=1` } } },
    }),
  });
  const data = await response.json() as { id?: string; links?: Array<{ rel: string; href: string }> };
  if (!response.ok || !data.id) throw new AppApiError(502, "PAYPAL_ERROR", "Invoice PayPal gagal dibuat");
  return db.payment.create({
    data: {
      id, userId, method, amount: 0, baseAmount: PRICE_IDR, amountUsd: PRICE_USD,
      currency: "USD", reference: id, gateway: "paypal", gatewayRef: data.id,
      approveUrl: data.links?.find((link) => link.rel === "payer-action" || link.rel === "approve")?.href || null,
      expiresAt,
    },
  });
}

export function serializePayment(payment: {
  id: string; method: string; amount: number; amountUsd: Prisma.Decimal | null; currency: string;
  status: string; reference: string; gateway: string; qrString: string | null; qrUrl: string | null;
  approveUrl: string | null; expiresAt: Date; uniqueSuffix: number;
}, activation?: { code: string } | null) {
  const isPaypal = payment.currency === "USD";
  return {
    id: payment.id,
    method: payment.method,
    amount: payment.amount,
    amount_display: isPaypal ? `US$ ${payment.amountUsd?.toFixed(2) || "10.00"}` : `Rp ${payment.amount.toLocaleString("id-ID")}`,
    unique_suffix: payment.uniqueSuffix,
    status: payment.status,
    reference: payment.reference,
    gateway: payment.gateway,
    qr_string: payment.qrString,
    qr_url: payment.qrUrl,
    approve_url: payment.approveUrl,
    expires_at: payment.expiresAt.toISOString(),
    instructions: isPaypal
      ? { amount_display: `US$ ${payment.amountUsd?.toFixed(2) || "10.00"}`, steps: ["Buka PayPal", "Selesaikan pembayaran", "Kembali ke ORDAL"] }
      : { steps: ["Pindai QR dengan aplikasi bank atau dompet digital", "Bayar sesuai nominal", "Tunggu verifikasi otomatis"] },
    activation: activation ? { code: activation.code } : null,
  };
}

async function verifyPayment(paymentId: string, providerReference: string) {
  const payment = await db.payment.findUnique({ where: { id: paymentId } });
  if (!payment) throw new AppApiError(404, "PAYMENT_NOT_FOUND", "Pembayaran tidak ditemukan");
  if (payment.status === "verified") return ensureLicense(payment.userId, "payment", payment.id);
  return db.$transaction(async (tx) => {
    const current = await tx.payment.findUnique({ where: { id: payment.id } });
    if (!current) throw new AppApiError(404, "PAYMENT_NOT_FOUND", "Pembayaran tidak ditemukan");
    if (current.status !== "verified") {
      await tx.payment.update({ where: { id: current.id }, data: { status: "verified", gatewayRef: providerReference, verifiedAt: new Date() } });
    }
    return null;
  }).then(async () => ensureLicense(payment.userId, "payment", payment.id));
}

export async function checkPayment(paymentId: string, userId: string) {
  let payment = await db.payment.findFirst({ where: { id: paymentId, userId } });
  if (!payment) throw new AppApiError(404, "PAYMENT_NOT_FOUND", "Pembayaran tidak ditemukan");
  let license = payment.status === "verified" ? await ensureLicense(userId, "payment", payment.id) : null;
  if (payment.status === "pending" && payment.expiresAt <= new Date()) {
    payment = await db.payment.update({ where: { id: payment.id }, data: { status: "expired" } });
  } else if (payment.status === "pending" && payment.gateway === "paypal" && payment.gatewayRef) {
    const token = await paypalToken();
    let response = await fetch(`${paypalBase()}/v2/checkout/orders/${payment.gatewayRef}`, { headers: { Authorization: `Bearer ${token}` } });
    let order = await response.json() as { status?: string; purchase_units?: Array<{ custom_id?: string; amount?: { currency_code?: string; value?: string } }> };
    if (order.status === "APPROVED") {
      response = await fetch(`${paypalBase()}/v2/checkout/orders/${payment.gatewayRef}/capture`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "content-type": "application/json", "PayPal-Request-Id": `capture-${payment.id}` } });
      order = await response.json() as typeof order;
    }
    const unit = order.purchase_units?.[0];
    if (order.status === "COMPLETED" && unit?.custom_id === userId && unit.amount?.currency_code === "USD" && unit.amount.value === PRICE_USD.toFixed(2)) {
      license = await verifyPayment(payment.id, payment.gatewayRef);
      payment = await db.payment.findUniqueOrThrow({ where: { id: payment.id } });
    }
  }
  return serializePayment(payment, license);
}

export async function verifyMidtransNotification(body: Record<string, unknown>) {
  const orderId = typeof body.order_id === "string" ? body.order_id : "";
  const statusCode = typeof body.status_code === "string" ? body.status_code : "";
  const grossAmount = typeof body.gross_amount === "string" ? body.gross_amount : "";
  const signature = typeof body.signature_key === "string" ? body.signature_key : "";
  const expected = createHash("sha512").update(`${orderId}${statusCode}${grossAmount}${required("MIDTRANS_SERVER_KEY")}`).digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new AppApiError(401, "INVALID_SIGNATURE", "Signature tidak valid");
  const payment = await db.payment.findUnique({ where: { id: orderId } });
  if (!payment || payment.gateway !== "midtrans" || payment.amount !== PRICE_IDR || grossAmount !== `${PRICE_IDR}.00`) {
    throw new AppApiError(400, "PAYMENT_MISMATCH", "Data pembayaran tidak cocok");
  }
  const status = typeof body.transaction_status === "string" ? body.transaction_status : "";
  const fraud = typeof body.fraud_status === "string" ? body.fraud_status : "accept";
  if ((status === "settlement" || status === "capture") && fraud === "accept") await verifyPayment(payment.id, String(body.transaction_id || orderId));
  if (["deny", "cancel", "expire", "failure"].includes(status)) await db.payment.update({ where: { id: payment.id }, data: { status: status === "expire" ? "expired" : "failed" } });
}
