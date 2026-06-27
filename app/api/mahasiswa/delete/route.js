import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function DELETE(request) {
  try {
    const { discord_id } = await request.json()

    if (!discord_id) {
      return NextResponse.json(
        { success: false, message: 'discord_id wajib diisi' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('mahasiswa')
      .delete()
      .eq('discord_id', discord_id)
      .select()
      .single()

    if (error || !data) {
      return NextResponse.json(
        { success: false, message: 'Mahasiswa tidak ditemukan' },
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
