import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function DELETE(request) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID tugas wajib diisi' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('tugas')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error || !data) {
      return NextResponse.json(
        { success: false, message: 'Tugas tidak ditemukan' },
        { status: 404 }
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
