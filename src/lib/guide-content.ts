export type Guide = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  summary: string;
  updated: string;
  readingTime: string;
  sections: Array<{
    heading: string;
    paragraphs: string[];
    points?: string[];
  }>;
  faq: Array<{ q: string; a: string }>;
};

export const guides: Guide[] = [
  {
    slug: "ai-untuk-cari-kerja",
    title: "Cara Menggunakan AI untuk Cari Kerja",
    eyebrow: "AI untuk pencari kerja",
    description: "Cara memakai AI untuk membaca lowongan, mencocokkan CV, menyusun cover letter, berlatih interview, dan mengotomatisasi pencarian kerja tanpa mengarang pengalaman.",
    summary: "AI paling berguna sebagai alat bantu analisis dan otomasi. Gunakan AI untuk memahami lowongan, menyesuaikan bahasa CV, menyiapkan cover letter, dan mengurangi pekerjaan berulang. Jangan gunakan AI untuk membuat pengalaman atau kemampuan yang tidak kamu miliki.",
    updated: "1 Oktober 2026",
    readingTime: "6 menit",
    sections: [
      {
        heading: "Bagian pencarian kerja yang bisa dibantu AI",
        paragraphs: [
          "AI dapat membaca deskripsi pekerjaan, merangkum tanggung jawab, menemukan kata kunci penting, dan membandingkan kebutuhan perusahaan dengan isi CV.",
          "Untuk pekerjaan repetitif, AI juga dapat membantu menyarankan target posisi, membuat draf cover letter, menyimpan jawaban screening, dan menjalankan pencarian berdasarkan aturan pengguna.",
        ],
        points: ["Analisis deskripsi pekerjaan", "Pemetaan kemampuan dari CV", "Saran target posisi", "Draf cover letter", "Latihan interview", "Otomasi pencarian dan form berulang"],
      },
      {
        heading: "Cara memberi instruksi yang baik ke AI",
        paragraphs: [
          "Berikan CV asli, posisi target, lokasi, level pengalaman, dan batasan yang jelas. Minta AI menunjukkan bagian yang tidak ditemukan di CV, bukan menebaknya.",
          "Instruksi yang aman: gunakan hanya fakta dalam CV, tandai informasi yang belum ada, lalu tanyakan ke pengguna sebelum menambahkan informasi baru.",
        ],
      },
      {
        heading: "Kapan otomasi seperti ORDAL membantu",
        paragraphs: [
          "ORDAL membantu saat kamu punya beberapa target, harus mengecek lowongan berulang, atau sering mengisi pertanyaan yang sama. Kamu tetap memilih CV, posisi, lokasi, platform, dan pengecualian.",
          "Otomasi tidak menggantikan strategi. Hasil terbaik datang dari target yang spesifik, CV yang relevan, dan jawaban yang benar.",
        ],
      },
      {
        heading: "Batas yang tidak boleh dilewati",
        paragraphs: ["AI tidak boleh mengarang pengalaman, gelar, sertifikasi, gaji, izin kerja, atau kemampuan. Semua informasi yang dikirim ke perusahaan harus bisa dipertanggungjawabkan oleh pelamar."],
      },
    ],
    faq: [
      { q: "Apakah AI bisa membuat CV?", a: "Bisa membantu menyusun dan memperjelas CV, tetapi isi faktual harus berasal dari pengalaman pengguna. Periksa setiap angka, jabatan, tanggal, dan kemampuan sebelum dipakai." },
      { q: "Apakah AI bisa melamar kerja otomatis?", a: "Bisa pada alur yang didukung oleh alat dan platform. Pengguna tetap perlu mengatur target, memilih CV, menjaga akun, dan memastikan semua jawaban benar." },
      { q: "AI apa yang cocok untuk cari kerja?", a: "Pilih AI yang dapat mengikuti instruksi dengan baik dan punya kebijakan data yang sesuai kebutuhanmu. ORDAL memungkinkan pengguna memilih satu provider AI, jadi tidak perlu mengisi semua provider." },
      { q: "Apakah hasil AI selalu benar?", a: "Tidak. AI dapat salah memahami CV atau lowongan. Gunakan hasilnya sebagai draf dan periksa fakta sebelum dikirim." },
    ],
  },
  {
    slug: "cv-ats-friendly",
    title: "CV ATS Friendly: Pengertian dan Checklist",
    eyebrow: "Panduan CV ATS",
    description: "Pelajari arti CV ATS friendly, struktur yang mudah dibaca sistem rekrutmen, kesalahan umum, dan checklist sebelum mengirim lamaran kerja.",
    summary: "CV ATS friendly adalah CV dengan teks yang mudah dipindai, judul bagian yang jelas, urutan pengalaman yang konsisten, dan kata kunci yang relevan. Desain tidak harus polos, tetapi informasi utama jangan bergantung pada gambar, ikon, grafik, atau layout rumit.",
    updated: "1 Oktober 2026",
    readingTime: "7 menit",
    sections: [
      {
        heading: "Apa itu ATS?",
        paragraphs: [
          "Applicant Tracking System atau ATS adalah sistem yang membantu perusahaan menerima, menyimpan, mencari, dan menyaring data pelamar. Kemampuan setiap ATS berbeda, jadi tidak ada format yang menjamin lolos.",
          "Tujuan CV ATS friendly bukan menipu sistem. Tujuannya membuat pengalaman dan kemampuanmu terbaca jelas oleh mesin dan recruiter.",
        ],
      },
      {
        heading: "Struktur CV yang mudah dibaca",
        paragraphs: ["Gunakan urutan yang konsisten dan nama bagian yang umum. Tulis pengalaman terbaru lebih dulu jika format kronologis paling sesuai."],
        points: ["Nama dan kontak", "Ringkasan profesional yang spesifik", "Pengalaman kerja", "Pendidikan", "Kemampuan relevan", "Sertifikasi atau proyek jika mendukung target"],
      },
      {
        heading: "Checklist CV ATS friendly",
        paragraphs: ["Sebelum mengirim, salin semua teks CV ke editor teks. Jika urutannya berantakan atau informasi penting hilang, struktur file perlu disederhanakan."],
        points: ["Pakai heading standar", "Hindari informasi penting di header atau footer", "Gunakan kata kunci sesuai konteks", "Simpan sebagai PDF berbasis teks", "Tulis pencapaian secara spesifik", "Pastikan tanggal dan jabatan konsisten"],
      },
      {
        heading: "Gunakan CV berbeda untuk target berbeda",
        paragraphs: ["Satu CV tidak harus melayani semua pekerjaan. Jika targetmu berbeda jauh, buat versi CV yang menonjolkan pengalaman paling relevan untuk masing-masing jalur. ORDAL dapat menghubungkan CV berbeda ke target yang berbeda."],
      },
    ],
    faq: [
      { q: "Apakah CV ATS harus satu kolom?", a: "Tidak selalu, tetapi satu kolom lebih mudah diprediksi. Jika memakai beberapa kolom, pastikan urutan teks tetap benar saat disalin." },
      { q: "Apakah CV ATS boleh berwarna?", a: "Boleh. Warna tidak otomatis membuat CV gagal. Prioritaskan kontras, keterbacaan, dan struktur teks." },
      { q: "Apakah foto harus dihapus?", a: "Tergantung negara, industri, dan kebiasaan perusahaan. Foto biasanya tidak membantu ATS membaca kualifikasi dan dapat dihilangkan jika tidak diminta." },
      { q: "Apakah kata kunci harus diulang banyak kali?", a: "Tidak. Gunakan kata kunci secara wajar dalam konteks pengalaman nyata. Pengulangan berlebihan membuat CV sulit dibaca dan tidak menambah bukti kemampuan." },
    ],
  },
  {
    slug: "auto-apply-lowongan",
    title: "Auto Apply Lowongan Kerja: Cara Aman dan Efektif",
    eyebrow: "Otomasi lamaran kerja",
    description: "Panduan auto apply lowongan kerja yang tetap relevan: target spesifik, CV yang tepat, pengecualian, jawaban faktual, keamanan akun, dan evaluasi hasil.",
    summary: "Auto apply berguna untuk mengurangi proses berulang, bukan untuk mengirim lamaran sebanyak mungkin. Atur target sempit, pilih CV yang sesuai, blokir posisi atau perusahaan yang tidak diinginkan, dan evaluasi hasil secara berkala.",
    updated: "1 Oktober 2026",
    readingTime: "6 menit",
    sections: [
      {
        heading: "Apa itu auto apply?",
        paragraphs: ["Auto apply adalah otomasi sebagian proses lamaran, mulai dari menemukan lowongan hingga mengisi form yang didukung. Tingkat otomatisasinya berbeda pada setiap platform dan jenis lowongan."],
      },
      {
        heading: "Auto apply yang baik tetap memakai strategi",
        paragraphs: ["Jumlah lamaran bukan satu-satunya ukuran. Lamaran harus sesuai kemampuan, lokasi, level, jenis pekerjaan, dan tujuan karier."],
        points: ["Pisahkan target berdasarkan jalur karier", "Pasangkan CV dengan target yang tepat", "Tentukan lokasi dan jenis kerja", "Gunakan daftar posisi yang dilarang", "Blokir perusahaan tertentu bila perlu", "Hindari lamaran duplikat"],
      },
      {
        heading: "Jaga jawaban tetap benar",
        paragraphs: ["Jawaban screening seperti pengalaman, izin kerja, ekspektasi gaji, dan kesediaan relokasi harus berasal dari pengguna. Jika informasi tidak ada di CV atau data tersimpan, sistem seharusnya bertanya, bukan mengarang."],
      },
      {
        heading: "Evaluasi kualitas, bukan hanya jumlah",
        paragraphs: ["Periksa lowongan yang ditemukan, lamaran yang terkirim, alasan lowongan dilewati, dan respons recruiter. Jika hasil tidak relevan, perbaiki target atau CV sebelum melanjutkan."],
      },
      {
        heading: "Cara ORDAL menjalankan auto apply",
        paragraphs: ["ORDAL meminta pengguna menentukan strategi lebih dulu. Aplikasi lalu mencari lowongan, memeriksa kecocokan dan duplikat, memakai CV pilihan pengguna, serta menyimpan jawaban yang sudah dikonfirmasi untuk pertanyaan serupa."],
      },
    ],
    faq: [
      { q: "Apakah auto apply membuat akun diblokir?", a: "Risiko bergantung pada aturan dan perubahan setiap platform. Gunakan batas yang wajar, ikuti ketentuan platform, dan hentikan otomasi jika muncul verifikasi atau peringatan akun." },
      { q: "Apakah semakin banyak lamaran semakin baik?", a: "Tidak selalu. Lamaran yang relevan dengan CV dan target biasanya lebih berguna daripada volume tinggi yang tidak terarah." },
      { q: "Apakah cover letter bisa dibuat otomatis?", a: "Bisa dibuat sebagai draf berdasarkan CV dan target posisi. Pengguna tetap harus memastikan isi, nama perusahaan, jabatan, dan klaim pengalaman benar." },
      { q: "Bagaimana mencegah lamaran ganda?", a: "Gunakan riwayat lamaran dan identitas lowongan untuk memeriksa apakah posisi yang sama sudah pernah diproses." },
    ],
  },
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
