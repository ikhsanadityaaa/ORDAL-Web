import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { appError } from "@/lib/app-route";
import { AppApiError, authenticateAppRequest } from "@/lib/app-api";
import { serializePayment } from "@/lib/payments";

export async function POST(req: Request, context: { params: Promise<{ paymentId: string }> }) {
  try {
    const session = await authenticateAppRequest(req);
    const { paymentId } = await context.params;
    const payment = await db.payment.findFirst({ where: { id: paymentId, userId: session.userId } });
    if (!payment) throw new AppApiError(404, "PAYMENT_NOT_FOUND", "Pembayaran tidak ditemukan");
    if (payment.gateway !== "manual") throw new AppApiError(400, "AUTO_VERIFICATION", "Pembayaran diverifikasi otomatis");
    const updated = await db.payment.update({ where: { id: payment.id }, data: { status: "verifying" } });
    return NextResponse.json(serializePayment(updated));
  } catch (error) {
    return appError(error);
  }
}
