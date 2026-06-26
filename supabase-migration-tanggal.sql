-- Jalankan query ini di Supabase Dashboard > SQL Editor
-- Menambahkan kolom tanggal (opsional / nullable) ke tabel jadwal

ALTER TABLE jadwal
ADD COLUMN IF NOT EXISTS tanggal date;
