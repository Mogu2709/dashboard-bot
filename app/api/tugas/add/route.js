import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendToTugas } from '@/lib/discord'

export async function POST(request) {
  const body = await request.json()

  await supabase.from('tugas').insert({
    mata_kuliah: body.mata_kuliah,
    judul: body.judul,
    deskripsi: body.deskripsi,
    deadline: body.deadline,
    link_drive: body.link_drive || null,
    dibuat_oleh: 'Dashboard',
  })

  await sendToTugas({
    title: `📝 Tugas Baru — ${body.mata_kuliah}`,
    description: `**${body.judul}**\n\n${body.deskripsi}`,
    color: 0xf97316,
    fields: [
      { name: '⏰ Deadline', value: body.deadline, inline: true },
      { name: '📚 Mata Kuliah', value: body.mata_kuliah, inline: true },
      ...(body.link_drive ? [{ name: '📁 Link Pengumpulan', value: `[Klik di sini](${body.link_drive})`, inline: false }] : []),
    ],
    footer: { text: 'Diumumkan via Dashboard Kelas' },
    timestamp: new Date().toISOString(),
  })

  return NextResponse.json({ success: true })
}