import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendToJadwal } from '@/lib/discord'

export async function POST(request) {
  try {
    const body = await request.json()

    if (!body.hari?.trim() || !body.mata_kuliah?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Hari dan mata kuliah wajib diisi' },
        { status: 400 }
      )
    }

    const payload = { ...body, tanggal: body.tanggal?.trim() ? body.tanggal : null }

    const { data, error } = await supabase
      .from('jadwal')
      .insert(payload)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      )
    }

    try {
      await sendToJadwal({
        title: `🗓️ Jadwal Baru Ditambahkan`,
        color: 0x6366f1,
        fields: [
          { name: '📅 Hari', value: body.hari, inline: true },
          ...(body.tanggal ? [{ name: '🗓️ Tanggal', value: body.tanggal, inline: true }] : []),
          { name: '📚 Mata Kuliah', value: body.mata_kuliah, inline: true },
          { name: '👨‍🏫 Dosen', value: body.dosen, inline: true },
          { name: '🕐 Jam', value: `${body.jam_mulai} - ${body.jam_selesai}`, inline: true },
          { name: '📍 Ruangan', value: body.ruangan, inline: true },
        ],
        footer: { text: 'Ditambahkan via Dashboard Kelas' },
        timestamp: new Date().toISOString(),
      })
    } catch (discordError) {
      // Data sudah tersimpan di database; gagal kirim ke Discord bukan alasan untuk gagalkan keseluruhan request.
      return NextResponse.json({
        success: true,
        data,
        warning: `Tersimpan, tapi gagal kirim notifikasi Discord: ${discordError.message}`,
      })
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || 'Terjadi kesalahan' },
      { status: 500 }
    )
  }
}