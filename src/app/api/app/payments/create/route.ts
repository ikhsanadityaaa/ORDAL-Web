import { NextResponse } from "next/server";
import { appError } from "@/lib/app-route";
import { AppApiError, authenticateAppRequest, hasPermanentAccess } from "@/lib/app-api";
import { createPayment, serializePayment } from "@/lib/payments";

export async function POST(req: Request) {
  try {
    const session = await authenticateAppRequest(req);
    if ((await hasPermanentAccess(session.userId))?.allowed) {
      throw new AppApiError(409, "ALREADY_ACTIVE", "Akun sudah memiliki akses permanen");
    }
    const body = await req.json() as { method?: string };
    const payment = await createPayment(session.userId, body.method || "");
    return NextResponse.json(serializePayment(payment));
  } catch (error) {
    return appError(error);
  }
}
