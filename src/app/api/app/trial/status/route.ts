import { NextResponse } from "next/server";
import { PRICE_IDR, PRICE_USD } from "@/lib/payment-invoice";
import { appError } from "@/lib/app-route";
import { authenticateAppRequest, getAccessStatus } from "@/lib/app-api";

export async function GET(req: Request) {
  try {
    const session = await authenticateAppRequest(req);
    return NextResponse.json({
      ...await getAccessStatus(session.userId, session.device.deviceKey),
      pricing: {
        idr: PRICE_IDR,
        usd: PRICE_USD.toNumber(),
        display_idr: `Rp ${PRICE_IDR.toLocaleString("id-ID")}`,
        display_usd: `US$ ${PRICE_USD.toFixed(2)}`,
      },
      payments_simulated: false,
    });
  } catch (error) {
    return appError(error);
  }
}
