import { NextResponse } from "next/server";
import { appError } from "@/lib/app-route";
import { authenticateAppRequest } from "@/lib/app-api";
import { checkPayment } from "@/lib/payments";

export async function POST(req: Request, context: { params: Promise<{ paymentId: string }> }) {
  try {
    const session = await authenticateAppRequest(req);
    const { paymentId } = await context.params;
    return NextResponse.json(await checkPayment(paymentId, session.userId));
  } catch (error) {
    return appError(error);
  }
}
