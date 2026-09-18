import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ordal.app";

/*
 * Dynamic Open Graph card — exact brand colors, rendered on the fly
 * so the OG preview always matches the site (no AI-generated drift).
 */
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#F4F2EC",
          backgroundImage:
            "radial-gradient(circle, rgba(51,54,63,0.10) 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top: brand chip */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              backgroundColor: "#F2661A",
              borderRadius: 16,
              border: "4px solid #33363F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontSize: 34,
              fontWeight: 800,
            }}
          >
            O
          </div>
          <div
            style={{
              display: "flex",
              backgroundColor: "#33363F",
              color: "#F4F2EC",
              padding: "12px 28px",
              borderRadius: 999,
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: 3,
            }}
          >
            AI JOB SEARCH AGENT
          </div>
        </div>

        {/* Middle: headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 108,
              fontWeight: 800,
              color: "#33363F",
              letterSpacing: -4,
              lineHeight: 1,
              display: "flex",
            }}
          >
            Biar ORDAL
          </div>
          <div
            style={{
              fontSize: 108,
              fontWeight: 800,
              color: "#F2661A",
              letterSpacing: -4,
              lineHeight: 1,
              display: "flex",
            }}
          >
            cariin buat kamu.
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 600,
              color: "rgba(51,54,63,0.65)",
              display: "flex",
            }}
          >
            Cari lowongan, filter, dan apply lamaran otomatis sesuai CV kamu.
          </div>
        </div>

        {/* Bottom: price + platforms */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              backgroundColor: "#F2661A",
              color: "#FFFFFF",
              border: "4px solid #33363F",
              padding: "14px 32px",
              borderRadius: 999,
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            Rp179.000 | SEKALI BAYAR
          </div>
          <div
            style={{
              display: "flex",
              color: "rgba(51,54,63,0.55)",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            WINDOWS + MACOS | {siteUrl.replace("https://", "").toUpperCase()}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
