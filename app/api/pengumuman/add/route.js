import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const TIPE_COLOR = {
  info:    0x6366f1,
  penting: 0xef4444,
  acara:   0x10b981,
}

const TIPE_LABEL = {
  info:    '📢 Info',
  penting: '🔴 Penting',
  acara:   '🗓️ Acara',
}

async function kirimWebhookPengumuman(judul, isi, tipe) {
  const url = process.env.DISCORD_WEBHOOK_PENGUMUMAN
  if (!url) return false

  const color = TIPE_COLOR[tipe] ?? TIPE_COLOR.info
  const label = TIPE_LABEL[tipe] ?? TIPE_LABEL.info

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'Dashboard Kelas',
      avatar_url: 'https://cdn-icons-png.flaticon.com/512/2541/2541988.png',
      content: tipe === 'penting' ? '@everyone' : undefined,
      embeds: [{
        title: `${label} — ${judul}`,
        description: isi,
        color,
        footer: { text: 'Pengumuman via Dashboard Kelas' },
        timestamp: new Date().toISOString(),
      }],
    }),
  })
  return res.ok
}

export async function POST(request) {
  try {
    const { judul, isi, tipe = 'info' } = await request.json()

    if (!judul?.trim() || !isi?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Judul dan isi pengumuman wajib diisi' },
        { status: 400 }
      )
    }

    if (!['info', 'penting', 'acara'].includes(tipe)) {
      return NextResponse.json(
        { success: false, message: 'Tipe tidak valid' },
        { status: 400 }
      )
    }

    let dikirimDiscord = false
    try {
      dikirimDiscord = await kirimWebhookPengumuman(judul, isi, tipe)
    } catch {
      // lanjut simpan ke DB meski Discord gagal
    }

    const { data, error } = await supabase.from('pengumuman').insert({
      judul,
      isi,
      tipe,
      dikirim_discord: dikirimDiscord,
    }).select().single()

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
      dikirim_discord: dikirimDiscord,
      warning: !dikirimDiscord ? 'Tersimpan, tapi gagal kirim ke Discord (cek DISCORD_WEBHOOK_PENGUMUMAN)' : undefined,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Terjadi kesalahan' },
      { status: 500 }
    )
  }
}
