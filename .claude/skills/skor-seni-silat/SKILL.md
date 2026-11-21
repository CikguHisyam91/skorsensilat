---
name: skor-seni-silat
description: Use when working on the Sistem Pemarkahan Silat in the skorsensilat repository (index.html, firebase-rules.json, SalinanSheet.gs), or when the user asks about silat scoring, juri, Ketua Pertandingan (KP), Dewan Juri (DJ), borang KPM (Seni Tari, Seni Tempur, Silat Asli, Seni Jurus) or PESAKA (Solo Kreatif, Ganda, Regu, Tunggal), PIN, poster QR, keputusan, diskualifikasi, Firebase, GitHub Pages or Google Sheet salinan.
---

# Sistem Pemarkahan Silat (KPM & PESAKA)

Sistem pemarkahan digital masa nyata untuk pertandingan silat: 3–5 juri (telefon), 1 KP/DJ (laptop), 1 paparan penonton. Pemilik merancang **mengkomersialkannya**.

## Pengguna

- Seorang **guru, bukan pengatur cara**. Balas dalam **Bahasa Melayu**, ayat mudah, langkah bernombor, satu langkah pada satu masa.
- Lebih suka fail diganti **sepenuhnya** (padam semua, tampal semua) dan semuanya **percuma** (Google Sheet, Apps Script, GitHub, Firebase pelan Spark).
- Mahu **lihat contoh dahulu** sebelum projek sebenar: kemas kini demo dan tunjuk tangkapan skrin.
- Penambahbaikan yang dicadangkan: **maklumkan dahulu**, tunggu persetujuan.
- Bahan pemasaran / video: **jangan sebut "percuma"** atau nama teknologi.
- Pengguna sudah membenarkan: setiap perubahan yang siap dan diuji terus **commit & push ke `main`** (GitHub Pages dikemas kini sendiri 1–2 minit). Sentiasa beritahu apa yang diubah.

## Seni bina

| Fail | Peranan |
|---|---|
| `index.html` | Seluruh aplikasi (satu fail). Paparan ikut URL: `?v=kp`, `?v=juri&j=1..5`, `?v=penonton`, tiada = menu. Mengandungi `FIREBASE_CONFIG` dan `SHEET_URL` sebenar — **jangan kosongkan**. |
| `firebase-rules.json` | Rules Realtime Database. Perubahan **mesti ditampal sendiri oleh pengguna** di Firebase → Realtime Database → Rules → Publish. Beritahu mereka setiap kali ia berubah. |
| `PANDUAN-KEJOHANAN.md` + kod `/* SISTEM KEJOHANAN (Seni) */` dalam index.html | Sambungan ke **Sistem Pengurusan Kejohanan** (Apps Script lain, `KEJ_URL_ASAL`): KP → 🗂 DATA → 🏟️ ambil kategori Seni & giliran undian; selepas SAHKAN, keputusan (kedudukan, markah, DQ/UD) dihantar semula untuk kiraan pingat (`hantarKej`, baris gilir dicuba semula setiap 30 s). Kategori daripadanya ada `kej.katId`; jangan tukar undian/pasukan kategori itu. |
| `SalinanSheet.gs` | Apps Script Web App (projek `script.new` berasingan). Satu fail Sheet bagi setiap nama kejohanan dalam folder Drive "KEPUTUSAN SILAT", satu tab bagi setiap kategori disahkan. Perubahan → pengguna: Deploy → Manage deployments → ✏ → New version (URL kekal). |

Laman: `https://cikguhisyam91.github.io/skorsensilat/` · Projek Firebase: `skorsenisilat` (asia-southeast1).

**Struktur data Firebase**
- `rahsia/{kp,juri1..juri5}` PIN (baca: KP sahaja) · `sedia` · `login/{peranan}/{uid}` = PIN (Rules sahkan sama dengan rahsia) · `sesi/{peranan}` = uid aktif (log masuk baru → peranti lama auto keluar).
- `pub/meta`: `kejohanan`, `aktif`, `senarai/{id}`, `rehat`, `rehatMsg`, `sheetUrl`, `sheetFail`.
- `pub/kat/{id}`: `nama, jenis, acara, tarikh, bilJuri, kaedah (jumlah|purata|median), buangHL, skala10, masa{sasaran,toleransi,tolakLebih,tier[]}, peserta{pid:{undian,nama,pasukan,ud,dq,dqSebab}}, semasa, markah{pid:{j:{v,c,t,ed,dq}}}, tolak{pid:{kod:bil}}, rekodMasa{pid:saat}, paparMarkah, sah{oleh,dj,masa}, keputusan[]`.
- Rules: juri hanya tulis `markah/{pid}/{j}` sendiri; KP tulis lain-lain; selepas `sah` dikunci kecuali KP padam keseluruhan kategori.

## Peraturan pemarkahan (sudah disahkan pengguna)

**KPM** (`jenis` I–IV): juri tekan rata-rata dari M (cth M 12, −4..+4), setiap item mesti ditekan (✗→✓). Silat Asli ada penolakan juri 0/−1/−2. Masa: semua 2:00 kecuali Silat Asli 3:00; **kurang masa** ditolak (1–10 s: 5, 11–20: 10, >20: 15), **lebih masa tidak ditolak**. Penolakan KP: Jatuh Aksesori 1, Pijak Tengkolok 1 (mak 5), Keluar Gelanggang 1 (mak 5), Jatuh Tengkolok 2, Meludah 2, Isyarat Lucah 2. Lalai: jumlah 3 juri.

**PESAKA** (lalai median juri + skala 10 = markah ÷ maksimum × 10, 2 perpuluhan; nilai ditaip, nombor bulat; hukuman & masa hanya untuk KP/DJ/Pengamat Waktu):
| Jenis | Borang | Hukuman | Masa |
|---|---|---|---|
| `PS` Solo Kreatif | Wiraga 25–50, Wirasa 15–30 | Jatuh Aksesori 5, Keluar Gelanggang 5 | ±15–30 s: 5, >30: 10 |
| `PG` Ganda | Teknik 50–80, Kemantapan 50–60, Penghayatan 50–60 | Keluar Garisan, Senjata Lepas, Pakaian 5 | sama PS |
| `PR` Regu | 12 jurus/100 gerakan, juri tekan +1 SALAH; Kebenaran = 100 − salah; Kemantapan 50–60 | Keluar Garisan 5, Pakaian 5 | ±6–10 s: 10, 11–15: 15, ≥16: 20 |
| `PT` Tunggal | 14 jurus (Tangan Kosong 1–7, Golok 8–10, Tongkat 11–14) | Liwat Garis, Senjata Lepas, Pakaian 5 | sama PR |
- Semua 3:00 kecuali **Pra Tunas, Tunas, Pra Dini, Dini**: Solo Kreatif & Tunggal 1:30; Tunggal lalai Jurus 1–7 (nilai asal 50). KP boleh pilih **Tunggal sahaja** Jurus 1–N (kod `PT@N`). Regu sentiasa 12 jurus penuh.
- Acara: PRA TUNAS, TUNAS, PRA DINI, DINI, PRA REMAJA, REMAJA, DEWASA (SUKMA), BEBAS × PUTRA/PUTRI. Ganda = dua nama dalam satu baris.
- **DQ**: butang juri hanya Regu & Tunggal, dengan sebab. Ia **cadangan**; sah hanya bila ≥ 2/3 juri DAN KP tekan SAHKAN. Ganda & Solo tiada DQ juri; KP ada butang DISKUALIFIKASI untuk PESAKA.
- Keputusan Regu/Tunggal ada **rumusan kesalahan jurus** (post mortem jurulatih).

**Seri (semua format):** Bahagian A tertinggi → masa paling hampir sasaran → kurang penolakan.

## Aliran kerja perubahan

1. Ubah `index.html` (guna Edit; elak gantian global — lihat Kesilapan lazim).
2. `bash .claude/skills/skor-seni-silat/alat/bina-ujian.sh` → salinan ujian dengan pangkalan data tiruan `alat/mockdb.js` (meniru Firebase + Rules, PIN demo KP 1234, Juri 1111/2222/3333, data contoh semua 8 kategori). `?auto=1` = log masuk automatik.
3. Uji ciri baru dengan Playwright (telefon 360×780 untuk juri), kemudian **wajib** `node .claude/skills/skor-seni-silat/alat/semak-semua.js` → mesti `errs []`. Ambil tangkapan skrin dan lihat sendiri.
4. Commit (mesej jelas) & `git push origin main`. Jika Rules/Apps Script berubah, beri pengguna langkah tampal & publish.
5. Demo awam (jika wujud dalam sesi): terbit semula `app.html` + `mockdb.js` ke artifact demo yang sama.

## Kesilapan lazim (pernah berlaku)

| Simptom | Punca | Elak |
|---|---|---|
| Butang mati bila nama ada `'` (cth `'Abdul`) | Nama dimasukkan ke dalam `onclick="...'nama'..."` | Hantar `id` sahaja ke onclick; `esc()` untuk paparan |
| Tab Keputusan ranap "Maximum call stack" | Gantian global `fx(r.jumlah)`→`skor(r)` turut menukar fungsi `skor` sendiri | Gantian tepat satu tempat; jalankan semak-semua |
| Butang tak buat apa-apa dalam demo/iframe | `prompt()`/`alert()` disekat | Guna `modal()` dalam sistem; `confirm` hanya untuk tindakan kecil |
| Label "DQ JURI" pada semua baris | `r.jdq` ialah tatasusunan kosong (truthy) | Semak `.length` |
| Ralat bila tiada giliran dipilih | Guna `cur.id` tanpa semak `cur` | Semak `cur` dahulu |
| Panel KP kosong selepas cipta kategori | Render dilangkau semasa poll | `#kpmain[data-kat]` mesti sama dengan kategori semasa |
| Ujian Playwright klik tempat salah | `text=PERTANDINGAN` padan tajuk "KETUA PERTANDINGAN" | Guna `button:has-text(...)` atau id |
| Pelayan ujian `ERR_CONNECTION_REFUSED` | Pelayan http mati antara arahan | Jalankan semula `bina-ujian.sh` (guna `setsid`) |

## Dalam simpanan (belum dibuat — tanya pengguna dahulu)

- Paparan babak jurus semasa & "−1" langsung di skrin penonton untuk Regu/Tunggal (DJ tekan jurus seterusnya).
- Kaedah Standard Deviation untuk 10 juri (Solo Kreatif).
- Penyediaan komersial: banyak pelanggan/penganjur, logo, lesen, kuota Firebase.
