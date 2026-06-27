import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const sesi_id = searchParams.get('sesi_id')

  if (!sesi_id) {
    return NextResponse.json({ success: false, message: 'sesi_id wajib diisi' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('detail_absensi')
    .select('*')
    .eq('sesi_id', sesi_id)
    .order('waktu_hadir')

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, hadir: data || [] })
}
