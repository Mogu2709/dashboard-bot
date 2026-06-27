import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PATCH(request) {
  try {
    const { id, judul, isi, tipe } = await request.json()

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID wajib diisi' }, { status: 400 })
    }
    if (!judul?.trim() || !isi?.trim()) {
      return NextResponse.json({ success: false, message: 'Judul dan isi wajib diisi' }, { status: 400 })
    }
    if (!['info', 'penting', 'acara'].includes(tipe)) {
      return NextResponse.json({ success: false, message: 'Tipe tidak valid' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('pengumuman')
      .update({ judul, isi, tipe })
      .eq('id', id)
      .select()
      .single()

    if (error || !data) {
      return NextResponse.json({ success: false, message: error?.message || 'Pengumuman tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message || 'Terjadi kesalahan' }, { status: 500 })
  }
}
