import { NextResponse } from "next/server";
import { AppApiError } from "@/lib/app-api";

export function appError(error: unknown) {
  if (error instanceof AppApiError) {
    return NextResponse.json(
      { detail: { code: error.code, message: error.message, ...error.extra } },
      { status: error.status },
    );
  }
  console.error("App API error:", error);
  return NextResponse.json(
    { detail: { code: "SERVER_ERROR", message: "Terjadi gangguan server" } },
    { status: 500 },
  );
}
