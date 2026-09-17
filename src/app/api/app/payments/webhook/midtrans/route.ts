import { NextResponse } from "next/server";
import { appError } from "@/lib/app-route";
import { verifyMidtransNotification } from "@/lib/payments";

export async function POST(req: Request) {
  try {
    await verifyMidtransNotification(await req.json() as Record<string, unknown>);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return appError(error);
  }
}
