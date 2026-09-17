import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { appError } from "@/lib/app-route";
import { authenticateAppRequest } from "@/lib/app-api";

export async function POST(req: Request) {
  try {
    const session = await authenticateAppRequest(req);
    await db.appSession.delete({ where: { id: session.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return appError(error);
  }
}
