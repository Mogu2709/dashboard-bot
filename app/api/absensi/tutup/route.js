import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { callBotApi } from '@/lib/bot'

export async function POST(request) {
  try {
    const { sesi_id, mata_kuliah } = await request.json()

    if (!sesi_id || !mata_kuliah) {
      return NextResponse.json(
        { success: false, message: 'sesi_id dan mata_kuliah wajib diisi' },
        { status: 400 }
      )
    }

    const { data: sesi, error: fetchError } = await supabase
      .from('sesi_absensi')
      .select('*')
      .eq('sesi_id', sesi_id)
      .maybeSingle()

    if (fetchError) {
      return NextResponse.json(
        { success: false, message: fetchError.message },
        { status: 500 }
      )
    }

    if (!sesi) {
      return NextResponse.json(
        { success: false, message: 'Sesi tidak ditemukan' },
        { status: 404 }
      )
    }

    if (sesi.status === 'closed') {
      return NextResponse.json({ success: true, already_closed: true })
    }

    try {
      await callBotApi('/api/absensi/tutup', { sesi_id, mata_kuliah })
    } catch (botError) {
      return NextResponse.json(
        {
          success: false,
          message: `Gagal tutup sesi di Discord: ${botError.message}`,
        },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Terjadi kesalahan' },
      { status: 500 }
    )
  }
}
