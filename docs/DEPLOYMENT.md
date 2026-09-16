# ORDAL — Runbook Deployment (Supabase + Vercel)

Panduan berurutan untuk menjalankan ORDAL di production:
**Vercel** (aplikasi Next.js) + **Supabase PostgreSQL** (database) + **Groq** (chatbot).
Untuk detail variabel lingkungan lihat `.env.example`.

```
                         USER
                           │
                           ▼
                    ┌────────────┐
                    │   VERCEL   │
                    │  Next.js   │
                    │ API Routes │
                    └─────┬──────┘
             ┌────────────┼────────────┐
             ▼            ▼            ▼
       ┌──────────┐ ┌──────────┐ ┌──────────┐
       │ Supabase │ │   Groq   │ │  GitHub  │
       │PostgreSQL│ │ Chatbot  │ │  Source  │
       └──────────┘ └──────────┘ └──────────┘
```

---

## Prasyarat

- Akun [Supabase](https://supabase.com) (plan gratis cukup)
- Akun [Vercel](https://vercel.com) + repo GitHub project ini
- API key [Groq](https://console.groq.com/keys) (free tier tersedia)
- Prisma CLI tersedia di local machine (`bunx prisma` / `npx prisma`)

---

## Langkah 1 — Buat database Supabase

1. Buat **New project** di Supabase (pilih region terdekat, mis. Singapore).
2. Setelah project aktif, buka **Project Settings → Database → Connection string**.
3. Catat **dua** URL (ganti `[YOUR-PASSWORD]`):

   | URL | Port | Dipakai oleh |
   |---|---|---|
   | **Transaction pooler** | `6543` | `POSTGRES_PRISMA_URL` — runtime aplikasi (serverless-safe) |
   | **Session/direct** | `5432` | `POSTGRES_URL_NON_POOLING` — `prisma migrate deploy` / `db push` |

   Format lengkap:

   ```
   # POSTGRES_PRISMA_URL (pooler 6543 — wajib dengan parameter Prisma serverless):
   postgresql://postgres.<project-ref>:<PASSWORD>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1

   # POSTGRES_URL_NON_POOLING (direct 5432 — khusus migrasi):
   postgresql://postgres.<project-ref>:<PASSWORD>@aws-0-<region>.pooler.supabase.com:5432/postgres
   ```

> ⚠️ **Jangan** memakai connection string port `5432` untuk `POSTGRES_PRISMA_URL` di
> Vercel — koneksi direct bisa terputus saat serverless function cold-start.
> Pooler `6543` + `pgbouncer=true&connection_limit=1` adalah konfigurasi yang
> benar untuk Prisma di serverless.

---

## Langkah 2 — Set environment variables di Vercel

Buka **Project → Settings → Environment Variables**, tambahkan:

| Key | Value | Environment |
|---|---|---|
| `POSTGRES_PRISMA_URL` | dibuat otomatis oleh integrasi Supabase | Production, Preview |
| `POSTGRES_URL_NON_POOLING` | dibuat otomatis oleh integrasi Supabase | Production, Preview |
| `GROQ_API_KEY` | key dari console.groq.com | Production, Preview — **WAJIB** |
| `GROQ_MODEL` | *(opsional, default `openai/gpt-oss-120b`)* — harus model yang bisa diakses tier Groq Anda, lihat [daftar model](https://console.groq.com/docs/models) | Production |
| `NEXT_PUBLIC_SITE_URL` | URL publik deployment Anda, mis. `https://ordal-web.vercel.app` | Production, Preview |
| `ABUSE_HASH_SECRET` | nilai acak minimal 32 byte untuk hash IP, device, dan email canonical | Production, Preview |
| `BLOCKED_EMAIL_DOMAINS` | tambahan domain email sementara, dipisahkan koma | Production, Preview |
| `NEXT_PUBLIC_ORDAL_WINDOWS_URL` | URL HTTPS installer Windows | Production |
| `NEXT_PUBLIC_ORDAL_MACOS_URL` | URL HTTPS installer macOS | Production |

> ⚠️ **`GROQ_API_KEY` wajib diisi.** Tanpa key, `/api/chat` menolak melayani
> (503) dan widget chat menampilkan pesan "tidak bisa menjawab sekarang" —
> by design, production tidak boleh jatuh ke provider fallback mana pun.
>
> ⚠️ **Pilih model yang masih aktif.** Groq mematikan
> `llama-3.3-70b-versatile` untuk tier Free/Developer per
> **2026-08-16** (kini Enterprise-only) — error khasnya:
> `Groq API error 404: The model … does not exist or you do not have
> access to it`. Jika muncul, set `GROQ_MODEL` ke model aktif
> (mis. `openai/gpt-oss-120b`) lalu Redeploy.

---

## Langkah 3 — Jalankan migration SEBELUM aplikasi dipakai

**Vercel tidak otomatis menjalankan `prisma migrate deploy`.** Skema database
harus diterapkan secara eksplisit **sebelum deployment pertama menerima
traffic** — dari local machine (atau job CI terpisah):

```bash
# dari root project, ganti dengan URL milikmu:
POSTGRES_PRISMA_URL='postgresql://postgres.<ref>:<pass>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1' \
POSTGRES_URL_NON_POOLING='postgresql://postgres.<ref>:<pass>@aws-0-<region>.pooler.supabase.com:5432/postgres' \
  bun run db:deploy        # = prisma migrate deploy
```

Output yang benar: `1 migration found → applying 20260909072210_init … applied`.

> 📌 **Kenapa tidak otomatis di setiap build?** Migration otomatis pada tiap
> deployment berisiko (build paralel bisa race, migration gagal jalan saat
> sedang ada traffic). Praktik aman: jalankan **manual atau via CI/CD step
> terpisah yang berurutan** (deploy job: migrate → deploy). Perintah di atas
> idempoten — aman dijalankan berulang.

---

## Langkah 4 — Deploy ke Vercel

1. Import repo GitHub ke Vercel (framework: **Next.js** — terdeteksi otomatis).
2. **Build Command**: `next build`
   (boleh juga `bun run build`; keduanya aman — langkah penyalinan standalone
   di `bun run build` otomatis no-op/sukses di Vercel).
3. **Install Command**: default (`bun install` / `npm install`) — script
   `postinstall` menjalankan `prisma generate` otomatis, sesuai kebutuhan Vercel.
4. Deploy. Pastikan **Langkah 3 sudah selesai** sebelum deployment pertama
   menerima pengunjung.

Catatan build:
- `next.config.ts` memakai `output: "standalone"` — didukung penuh Vercel.
- Database **tidak** ikut dibundel ke dalam build artifact (PostgreSQL
  external); skema tidak pernah di-push/di-migrate oleh proses build
  (dijaga oleh `tests/database-runtime-build.sh`).

---

## Langkah 5 — Verifikasi pasca-deploy

Jalankan di domain production:

- [ ] Halaman `/` termuat penuh (hero, pricing, FAQ, footer sticky)
- [ ] **Register** akun baru via modal → muncul kode `ORD-USER-XXXXXX`, trial belum dimulai
- [ ] **Logout → Login** dengan email/password yang sama
- [ ] **Cek Supabase Dashboard → Table Editor**: row muncul di `User` dan `Session`; `Trial` muncul setelah klik Cari Kerja pertama
- [ ] **Download** (Windows/macOS) tercatat di tabel `Download`
- [ ] **Kode aktivasi**: bayar/generate → verify via `/api/activation/verify`
- [ ] **Chatbot**: balasan sukses (Groq aktif); tanya topik di luar ORDAL → ditolak sopan
- [ ] Register email duplikat → 409; password salah → 401

Jika chat menampilkan "tidak bisa menjawab sekarang": cek `GROQ_API_KEY` di
Vercel (lihat Vercel → Deployments → Functions log untuk pesan
`GROQ_API_KEY is not configured`).

### Troubleshooting chatbot cepat

1. **Buka `https://<domain-anda>/api/chat` di browser** (GET) — endpoint
   diagnostik yang mengecek konfigurasi **dan mengetes key Groq secara
   live** (1 request 1 token), tanpa membocorkan rahasia:
   - `{"ok":true,"provider":"groq","live":{"ok":true}}` → key valid,
     chatbot aktif.
   - `{"ok":false,"provider":"unconfigured","hint":"Set GROQ_API_KEY …"}`
     → **`GROQ_API_KEY` belum diisi di Vercel** → tambahkan di
     Settings → Environment Variables lalu **Redeploy** (env baru tidak
     berlaku untuk deployment yang sudah berjalan).
   - `{"ok":false,"provider":"groq","live":{"ok":false,"status":401/403,…}}`
     → **key ditolak Groq** (salah/kedaluwarsa/di-regenerate). Buat key
     baru di <https://console.groq.com/keys>, perbarui env var di Vercel,
     lalu Redeploy.
   - `{"ok":false,"live":{"ok":false,"status":429,…}}` → kuota/limit Groq
     kena — cek <https://console.groq.com/usage> (free tier reset harian).
2. Jika masih ragu: buka **Vercel → Project → Logs** dan cari
   `[api/chat] Groq API error …` — log ini menyertakan pesan error asli
   dari Groq (invalid API key / rate limit / model tidak tersedia), jadi
   penyebabnya langsung terbaca.

---

## Opsional — Migrasi data dari SQLite lama

Database production **dimulai dari kosong**: file SQLite lama (`db/custom.db`)
hanya berisi akun test lokal (diaudit 2026-09-09: 5 user test, 5 trial,
7 session, 0 download, 1 kode aktivasi milik akun test — tidak ada user
production).

Jika ternyata ada akun lama yang perlu dipulihkan:

```bash
POSTGRES_PRISMA_URL='<pooler-6543>' POSTGRES_URL_NON_POOLING='<direct-5432>' \
  bun run db:migrate-legacy     # scripts/migrate-sqlite-to-postgres.ts
```

- Idempoten (aman diulang); akun yang sudah ada di PostgreSQL **tidak**
  ditimpa — hanya `activationCode` yang kosong akan di-backfill.
- Session yang sudah kedaluwarsa tidak disalin.
- File SQLite hanya dibaca (read-only) — **tidak dihapus**.

---

## Catatan operasional

- **Rate limit chat** (`/api/chat`) menggunakan memori per-instance. Di Vercel
  tiap instance punya hitungan sendiri — cukup untuk traffic awal. Kalau
  traffic membesar, naikkan ke Upstash Redis / rate limiting berbasis
  Supabase. **Jangan di-over-engineer sekarang.**
- **Jangan hapus `db/custom.db`** sampai PostgreSQL production berjalan dan
  seluruh checklist Langkah 5 lolos.
- **Jangan commit `.env`** — hanya `.env.example` yang masuk repo
  (sudah dikonfigurasi di `.gitignore`).
- Local dev tetap memakai embedded PostgreSQL: `bun run db:serve`
  (port 5433) lalu `bun run dev`. Tidak ada PostgreSQL local? `bun run db:serve`
  otomatis dijalankan oleh startup dev sandbox (`.zscripts/dev.sh`).
