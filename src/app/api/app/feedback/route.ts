import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { appError } from "@/lib/app-route";
import { AppApiError, authenticateAppRequest } from "@/lib/app-api";

const CATEGORIES = new Set(["bug", "suggestion", "automation", "account", "payment", "other"]);
const DIAGNOSTIC_KEYS = new Set(["app_version", "os", "python", "architecture"]);

function cleanDiagnostics(value: unknown): Record<string, string> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const result: Record<string, string> = {};
  for (const [key, raw] of Object.entries(value)) {
    if (DIAGNOSTIC_KEYS.has(key) && typeof raw === "string") result[key] = raw.slice(0, 200);
  }
  return Object.keys(result).length ? result : null;
}

export async function POST(req: Request) {
  try {
    const session = await authenticateAppRequest(req);
    const body = await req.json() as { category?: unknown; message?: unknown; diagnostics?: unknown };
    const category = typeof body.category === "string" ? body.category.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (!CATEGORIES.has(category)) throw new AppApiError(400, "INVALID_CATEGORY", "Kategori feedback tidak valid");
    if (!message || message.length > 4000) throw new AppApiError(400, "INVALID_MESSAGE", "Pesan wajib diisi, maksimal 4.000 karakter");

    await db.feedback.deleteMany({ where: { deleteAfter: { lte: new Date() } } });
    const recent = await db.feedback.count({
      where: { userId: session.userId, createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) } },
    });
    if (recent >= 10) throw new AppApiError(429, "RATE_LIMIT", "Batas feedback tercapai. Coba lagi nanti");

    const reference = `FDB-${Date.now().toString(36).toUpperCase()}-${randomBytes(3).toString("hex").toUpperCase()}`;
    const feedback = await db.feedback.create({
      data: {
        reference,
        userId: session.userId,
        category,
        message,
        diagnostics: cleanDiagnostics(body.diagnostics) || undefined,
        deleteAfter: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      select: { reference: true, createdAt: true, deleteAfter: true },
    });
    return NextResponse.json({
      ok: true,
      reference: feedback.reference,
      received_at: feedback.createdAt.toISOString(),
      delete_after: feedback.deleteAfter.toISOString(),
    });
  } catch (error) {
    return appError(error);
  }
}
