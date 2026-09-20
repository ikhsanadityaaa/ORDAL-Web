import { ShieldCheck, Wifi } from "lucide-react";
import { AppleLogo, WindowsLogo } from "@/components/ordal/brand-icons";
import { Button } from "@/components/ui/button";
import { SectionHeader, stickerButtonPrimary } from "@/components/ordal/creative";

const platforms = [
  { name: "Windows", icon: WindowsLogo, url: process.env.NEXT_PUBLIC_ORDAL_WINDOWS_URL, note: "Windows 10 64-bit atau lebih baru" },
  { name: "macOS", icon: AppleLogo, url: process.env.NEXT_PUBLIC_ORDAL_MACOS_URL, note: "macOS 12 Monterey atau lebih baru" },
];

export function DownloadSection() {
  return (
    <section id="download" className="relative overflow-hidden bg-[#F4F2EC] py-24 md:py-28">
      <div className="absolute inset-0 grid-pattern pointer-events-none" aria-hidden />
      <div className="absolute left-1/2 top-14 h-56 w-[min(90vw,760px)] -translate-x-1/2 rounded-full bg-[#F2661A]/10 blur-3xl" aria-hidden />
      <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#173E76]/10 blur-3xl" aria-hidden />
      <div className="absolute left-1/2 top-16 h-1.5 w-32 -translate-x-1/2 rotate-[-3deg] bg-[#F2661A]" aria-hidden />
      <span className="absolute right-[8%] top-20 rotate-12 text-5xl font-black text-[#F2661A]/35" aria-hidden>✦</span>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="11"
          badge="Download ORDAL"
          title={<><mark className="hl">Download</mark> aplikasi ORDAL sekarang</>}
          subtitle="ORDAL tersedia sebagai aplikasi desktop untuk Windows dan macOS. Download gratis, lalu mulai trial 3 hari."
          className="mb-12 md:mb-16"
        />

        <div className="flex flex-wrap justify-center gap-5">
          {platforms.map(({ name, icon: Icon, url }) => (
            <Button key={name} asChild size="lg" className={`group h-16 min-h-16 px-8 text-base ${stickerButtonPrimary}`}>
              <a href={url || "#"} aria-disabled={!url}>
                <Icon className="h-5 w-5 transition-transform duration-200 group-hover:translate-y-0.5" />
                Download for {name}
              </a>
            </Button>
          ))}
        </div>

        <div className="relative mx-auto mt-14 max-w-4xl rounded-3xl border-2 border-[#33363F] bg-[#33363F] p-6 text-[#F4F2EC] shadow-[8px_8px_0_#F2661A] sm:p-8 md:mt-20">
          <div className="flex flex-col gap-3 border-b-2 border-dashed border-[#F4F2EC]/20 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="label-chip text-[#F2661A]">Sebelum install</p>
              <h3 className="mt-2 text-2xl font-black sm:text-3xl">Minimum spec Windows & macOS</h3>
            </div>
            <ShieldCheck className="h-8 w-8 shrink-0 text-[#F2661A]" aria-hidden="true" />
          </div>
          <ul className="mt-6 grid gap-3 text-sm font-medium sm:grid-cols-2 md:grid-cols-3">
            <li><strong className="text-[#F2661A]">CPU</strong><br />Intel Core i3 / AMD Ryzen 3 atau setara</li>
            <li><strong className="text-[#F2661A]">RAM</strong><br />4 GB minimum, 8 GB disarankan</li>
            <li><strong className="text-[#F2661A]">Storage</strong><br />1 GB kosong + ruang CV/cookies</li>
            <li><strong className="text-[#F2661A]">Windows</strong><br />Windows 10 64-bit atau lebih baru</li>
            <li><strong className="text-[#F2661A]">macOS</strong><br />macOS 12 Monterey atau lebih baru</li>
            <li className="flex items-start gap-2"><Wifi className="mt-0.5 h-4 w-4 shrink-0 text-[#F2661A]" /><span><strong className="text-[#F2661A]">Internet</strong><br />Koneksi stabil wajib</span></li>
          </ul>
          <p className="mt-7 text-xs leading-relaxed text-[#F4F2EC]/50">Batas praktis berdasarkan ORDAL-App v3.2.3. Belum merupakan hasil benchmark resmi. Performa dapat turun saat banyak target, CV, atau job platform aktif.</p>
        </div>
      </div>
    </section>
  );
}
