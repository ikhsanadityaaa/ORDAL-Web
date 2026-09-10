import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ORDAL — AI Job Search Agent",
    short_name: "ORDAL",
    description:
      "Aplikasi AI buat pencari kerja: nyari lowongan, cek kecocokan, dan apply lamaran otomatis sesuai CV & target kamu.",
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
