import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendToJadwal } from '@/lib/discord'

export async function POST(request) {
  const body = await request.json()

  await supabase.from('jadwal').insert(body)

  await sendToJadwal({
    title: `🗓️ Jadwal Baru Ditambahkan`,
    color: 0x6366f1,
    fields: [
      { name: '📅 Hari', value: body.hari, inline: true },
      { name: '📚 Mata Kuliah', value: body.mata_kuliah, inline: true },
      { name: '👨‍🏫 Dosen', value: body.dosen, inline: true },
      { name: '🕐 Jam', value: `${body.jam_mulai} - ${body.jam_selesai}`, inline: true },
      { name: '📍 Ruangan', value: body.ruangan, inline: true },
    ],
    footer: { text: 'Ditambahkan via Dashboard Kelas' },
    timestamp: new Date().toISOString(),
  })

  return NextResponse.json({ success: true })
}