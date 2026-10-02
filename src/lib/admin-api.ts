import { timingSafeEqual } from "crypto";

export function isAdminRequest(req: Request): boolean {
  const expected = process.env.ADMIN_API_TOKEN?.trim() || "";
  const supplied = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim();
  const left = Buffer.from(expected);
  const right = Buffer.from(supplied);
  return expected.length >= 32 && left.length === right.length && timingSafeEqual(left, right);
}
