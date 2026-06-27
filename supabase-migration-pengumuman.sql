-- Jalankan di Supabase Dashboard > SQL Editor
-- Membuat tabel pengumuman

create table if not exists pengumuman (
  id          bigint generated always as identity primary key,
  judul       text not null,
  isi         text not null,
  tipe        text not null default 'info' check (tipe in ('info', 'penting', 'acara')),
  dikirim_discord boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Enable RLS (opsional, sesuaikan dengan policy Supabase kamu)
alter table pengumuman enable row level security;

-- Policy: izinkan semua operasi dari service role / anon key dashboard
create policy "Allow all for dashboard" on pengumuman
  for all using (true) with check (true);
