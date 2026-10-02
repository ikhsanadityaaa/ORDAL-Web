import { NextResponse } from "next/server";
import { appError } from "@/lib/app-route";
import { authenticateAppRequest } from "@/lib/app-api";

function parts(version: string): number[] {
  return version.replace(/^v/, "").split(".").slice(0, 3).map((value) => Number.parseInt(value, 10) || 0);
}

function olderThan(current: string, target: string): boolean {
  const left = parts(current);
  const right = parts(target);
  return right.some((value, index) => value !== left[index] && value > left[index] && right.slice(0, index).every((item, i) => item === left[i]));
}

export async function GET(req: Request) {
  try {
    await authenticateAppRequest(req);
    const url = new URL(req.url);
    const platform = url.searchParams.get("platform") === "win32" ? "windows" : "macos";
    const current = url.searchParams.get("current") || "0.0.0";
    const latest = process.env.ORDAL_LATEST_VERSION?.trim() || current;
    const minimum = process.env.ORDAL_MINIMUM_VERSION?.trim() || "0.0.0";
    const downloadUrl = platform === "windows"
      ? process.env.ORDAL_WINDOWS_DOWNLOAD_URL?.trim()
      : process.env.ORDAL_MACOS_DOWNLOAD_URL?.trim();
    return NextResponse.json({
      current_version: current,
      latest_version: latest,
      update_available: olderThan(current, latest),
      mandatory: olderThan(current, minimum),
      download_url: downloadUrl || "https://www.applywithordal.com/download",
      checksum_sha256: process.env.ORDAL_RELEASE_SHA256?.trim() || null,
      release_notes: process.env.ORDAL_RELEASE_NOTES?.trim() || "",
    });
  } catch (error) {
    return appError(error);
  }
}
