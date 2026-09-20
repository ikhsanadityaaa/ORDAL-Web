import { Prisma } from "@prisma/client";

export const ORIGINAL_PRICE_IDR = 210000;
export const PRICE_IDR = 179000;
export const PRICE_USD = new Prisma.Decimal("12.00");

type Invoice = {
  id: string;
  name: string;
  email: string;
  method: string;
  currency: string;
  amount: number;
  amountUsd: Prisma.Decimal | null;
  paidAt: Date;
  activationCode: string;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]!);
}

function money(invoice: Invoice) {
  return invoice.currency === "USD"
    ? `US$${invoice.amountUsd?.toFixed(2) ?? PRICE_USD.toFixed(2)}`
    : `Rp${invoice.amount.toLocaleString("id-ID")}`;
}

export function paymentInvoiceContent(invoice: Invoice) {
  const total = money(invoice);
  const discount = invoice.currency === "IDR"
    ? `<tr><td style="padding:7px 0;color:#686a70">Original price</td><td style="padding:7px 0;text-align:right;text-decoration:line-through">Rp${ORIGINAL_PRICE_IDR.toLocaleString("id-ID")}</td></tr><tr><td style="padding:7px 0;color:#686a70">Discount</td><td style="padding:7px 0;text-align:right;color:#c94708">-Rp${(ORIGINAL_PRICE_IDR - invoice.amount).toLocaleString("id-ID")}</td></tr>`
    : "";
  const html = `<!doctype html><html><body style="margin:0;background:#f4f2ec;color:#33363f;font-family:Arial,sans-serif"><div style="max-width:620px;margin:0 auto;padding:32px 16px"><div style="background:#33363f;color:#f4f2ec;border:2px solid #33363f;border-radius:24px 24px 0 0;padding:24px 28px"><div style="font-size:30px;font-weight:900;letter-spacing:-1px">ORDAL<span style="color:#f2661a">.</span></div><div style="margin-top:6px;color:#d9d7d0">Payment invoice</div></div><div style="background:#fffdf8;border:2px solid #33363f;border-top:0;border-radius:0 0 24px 24px;padding:28px;box-shadow:8px 8px 0 #f2661a"><div style="display:inline-block;background:#f2661a;color:white;border:2px solid #33363f;border-radius:999px;padding:6px 12px;font-size:12px;font-weight:800">PAID</div><h1 style="margin:22px 0 8px;font-size:26px">Thank you, ${escapeHtml(invoice.name)}.</h1><p style="margin:0 0 24px;color:#686a70;line-height:1.6">Your lifetime ORDAL license is ready. Keep this invoice and activation code for your records.</p><table style="width:100%;border-collapse:collapse;border-top:2px dashed #d4d1c9;border-bottom:2px dashed #d4d1c9;padding:14px 0"><tr><td style="padding:16px 0 7px;color:#686a70">Invoice</td><td style="padding:16px 0 7px;text-align:right;font-weight:700">${escapeHtml(invoice.id)}</td></tr><tr><td style="padding:7px 0;color:#686a70">Paid on</td><td style="padding:7px 0;text-align:right">${invoice.paidAt.toLocaleDateString("en-US", { dateStyle: "long", timeZone: "UTC" })}</td></tr><tr><td style="padding:7px 0;color:#686a70">Product</td><td style="padding:7px 0;text-align:right">ORDAL Lifetime License</td></tr><tr><td style="padding:7px 0;color:#686a70">Payment method</td><td style="padding:7px 0;text-align:right">${escapeHtml(invoice.method === "paypal" ? "PayPal" : "QRIS")}</td></tr>${discount}<tr><td style="padding:7px 0 16px;font-size:18px;font-weight:800">Total paid</td><td style="padding:7px 0 16px;text-align:right;font-size:18px;font-weight:900">${total}</td></tr></table><div style="margin-top:24px;background:#173e76;color:white;border:2px solid #33363f;border-radius:16px;padding:20px;text-align:center"><div style="font-size:11px;font-weight:800;letter-spacing:1.5px">ACTIVATION CODE</div><div style="margin-top:8px;font-family:monospace;font-size:23px;font-weight:900;letter-spacing:1px">${escapeHtml(invoice.activationCode)}</div></div><p style="margin:24px 0 0;color:#686a70;font-size:13px;line-height:1.6">This purchase grants lifetime access to ORDAL for the account ${escapeHtml(invoice.email)}. Your license remains subject to ORDAL's device limit and terms.</p></div><p style="margin:24px 8px 0;text-align:center;color:#777;font-size:12px">ORDAL — Apply smarter. Get hired faster.</p></div></body></html>`;
  const text = [`ORDAL PAYMENT INVOICE`, `Status: PAID`, `Invoice: ${invoice.id}`, `Paid on: ${invoice.paidAt.toISOString()}`, `Customer: ${invoice.name} <${invoice.email}>`, `Product: ORDAL Lifetime License`, `Payment method: ${invoice.method === "paypal" ? "PayPal" : "QRIS"}`, `Total paid: ${total}`, `Activation code: ${invoice.activationCode}`, "", "This purchase grants lifetime access to ORDAL, subject to the device limit and terms."].join("\n");
  return { subject: `Your ORDAL invoice — ${invoice.id}`, html, text };
}

export async function deliverPaymentInvoice(invoice: Invoice) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  if (!apiKey || !from) throw new Error("Invoice email is not configured");
  const content = paymentInvoiceContent(invoice);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `payment-invoice/${invoice.id}` },
    body: JSON.stringify({ from, to: [invoice.email], ...content }),
  });
  if (!response.ok) throw new Error(`Invoice email failed (${response.status})`);
}
