Catatan GPT – Aplikasi Chatbot Lokal dengan Penyimpanan Data Dinamis

Aplikasi ini adalah chatbot berbasis web menggunakan Flask yang berfungsi sebagai catatan interaktif. Pengguna dapat menyimpan, mengedit, menghapus, dan menanyakan data secara fleksibel. Bot menggunakan fuzzy matching untuk mencari jawaban terbaik dari memori lokal (memory.json) dan memberi respons otomatis jika ditemukan kemiripan tinggi.

Fitur Utama:

1. Chat Interaktif:

Pengguna dapat menulis pesan di kolom input dan menerima jawaban bot.

Pesan bot dan pengguna ditampilkan dengan gaya chat ala terminal futuristik.



2. Dataset Dinamis:

Menyimpan data pertanyaan-jawaban lokal menggunakan localStorage atau memory.json.

Bot dapat meminta pengguna untuk mengajarkan jawaban baru jika data belum ada.



3. Fuzzy Matching:

Menggunakan algoritma SequenceMatcher untuk mencari jawaban dengan tingkat kemiripan ≥80%.



4. Manajemen Dataset:

Lihat/Edit Dataset melalui modal interaktif.

Import/Export JSON untuk memudahkan backup dan restore data.



5. CRUD untuk Memori:

/teach → Ajarkan pertanyaan dan jawaban baru ke bot.

/edit → Perbarui jawaban dari pertanyaan tertentu.

/delete → Hapus pertanyaan dan jawaban dari memori.



6. PWA-Friendly & Mobile-Ready:

Mendukung tampilan layar penuh di mobile.

Swipe kiri untuk navigasi.

Tampilan responsif dengan tema gelap neon.



7. Frontend Custom:

Chatbox, tombol menu, modal edit, dan efek visual seperti chat futuristik.

Semua UI dikendalikan melalui HTML, CSS, dan JS embedded di Flask.




Kegunaan:

Sebagai personal knowledge base atau catatan interaktif.

Cocok untuk pengumpulan jawaban cepat dan chatbot offline.

Bisa dikembangkan menjadi PWA atau aplikasi Android berbasis TWA.



---
