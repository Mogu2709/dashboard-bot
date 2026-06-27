import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendToTugas } from '@/lib/discord'

export async function POST(request) {
  try {
    const body = await request.json()

    if (!body.mata_kuliah?.trim() || !body.judul?.trim() || !body.deadline?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Mata kuliah, judul, dan deadline wajib diisi' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase.from('tugas').insert({
      mata_kuliah: body.mata_kuliah,
      judul: body.judul,
      deskripsi: body.deskripsi,
      deadline: body.deadline,
      link_drive: body.link_drive || null,
      dibuat_oleh: 'Dashboard',
    }).select().single()

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      )
    }

    try {
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
    } catch (discordError) {
      // Data sudah tersimpan; gagal Discord bukan alasan gagalkan keseluruhan request
      return NextResponse.json({
        success: true,
        data,
        warning: `Tersimpan, tapi gagal kirim notifikasi Discord: ${discordError.message}`,
      })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Terjadi kesalahan' },
      { status: 500 }
    )
  }
}
