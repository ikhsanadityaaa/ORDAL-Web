import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ORDAL — Aplikasi Cari Kerja Otomatis",
    short_name: "ORDAL",
    description:
      "Aplikasi desktop pencarian kerja otomatis yang mengikuti CV, target, platform, dan aturan pengguna. AI bersifat opsional.",
    start_url: "/",
    display: "standalone",
    background_color: "#F4F2EC",
    theme_color: "#F4F2EC",
    icons: [
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
