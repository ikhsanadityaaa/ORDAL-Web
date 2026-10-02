import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminRequest } from "@/lib/admin-api";

function csvCell(value: unknown): string {
  const text = value == null ? "" : typeof value === "string" ? value : JSON.stringify(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET(req: Request) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const rows = await db.feedback.findMany({
    include: { user: { select: { email: true } } },
    orderBy: { createdAt: "desc" },
    take: 5000,
  });
  if (url.searchParams.get("format") !== "csv") return NextResponse.json({ items: rows });

  const header = ["reference", "email", "category", "message", "status", "diagnostics", "created_at", "delete_after"];
  const lines = [header.map(csvCell).join(","), ...rows.map((row) => [
    row.reference, row.user.email, row.category, row.message, row.status,
    row.diagnostics, row.createdAt.toISOString(), row.deleteAfter.toISOString(),
  ].map(csvCell).join(","))];
  return new NextResponse(lines.join("\n"), {
    headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": "attachment; filename=ordal-feedback.csv" },
  });
}

export async function DELETE(req: Request) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const result = await db.feedback.deleteMany({ where: { deleteAfter: { lte: new Date() } } });
  return NextResponse.json({ ok: true, deleted: result.count });
}
