import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { callBotApi } from '@/lib/bot'

export async function POST(request) {
  try {
    const { mata_kuliah, durasi } = await request.json()

    if (!mata_kuliah?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Nama mata kuliah wajib diisi' },
        { status: 400 }
      )
    }

    const { data: sesiAktif } = await supabase
      .from('sesi_absensi')
      .select('sesi_id, mata_kuliah, durasi_menit')
      .eq('status', 'open')
      .limit(1)
      .maybeSingle()

    if (sesiAktif) {
      return NextResponse.json(
        {
          success: false,
          message: `Masih ada sesi aktif: ${sesiAktif.mata_kuliah}. Tutup dulu sebelum buka sesi baru.`,
          activeSesi: sesiAktif,
        },
        { status: 409 }
      )
    }

    const tanggal = new Date().toISOString().split('T')[0]
    const waktu_mulai = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    const sesi_id = `${tanggal}_${mata_kuliah.replace(/\s+/g, '_')}_${Date.now()}`

    const { error: insertError } = await supabase.from('sesi_absensi').insert({
      sesi_id,
      mata_kuliah,
      tanggal,
      waktu_mulai,
      durasi_menit: durasi,
      status: 'open',
    })

    if (insertError) {
      return NextResponse.json(
        { success: false, message: insertError.message },
        { status: 500 }
      )
    }

    try {
      await callBotApi('/api/absensi/buka', {
        sesi_id,
        mata_kuliah,
        tanggal,
        waktu_mulai,
        durasi_menit: durasi,
      })
    } catch (botError) {
      await supabase.from('sesi_absensi').delete().eq('sesi_id', sesi_id)
      return NextResponse.json(
        {
          success: false,
          message: `Gagal kirim ke Discord bot: ${botError.message}`,
        },
        { status: 502 }
      )
    }

    return NextResponse.json({
      success: true,
      sesi_id,
      mata_kuliah,
      durasi,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Terjadi kesalahan' },
      { status: 500 }
    )
  }
}
