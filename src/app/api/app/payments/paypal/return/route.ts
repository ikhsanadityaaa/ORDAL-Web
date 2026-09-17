import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  const cancelled = req.nextUrl.searchParams.get("cancel") === "1";
  const title = cancelled ? "Pembayaran dibatalkan" : "Pembayaran diterima";
  const message = cancelled ? "Tidak ada biaya yang diproses." : "Kembali ke ORDAL. Status akan diperbarui otomatis.";
  return new NextResponse(`<!doctype html><meta charset="utf-8"><title>${title}</title><body style="font-family:sans-serif;padding:40px"><h1>${title}</h1><p>${message}</p><p>Jendela ini boleh ditutup.</p></body>`, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
}
