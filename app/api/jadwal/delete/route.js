import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function DELETE(request) {
  const { id } = await request.json()
  await supabase.from('jadwal').delete().eq('id', id)
  return NextResponse.json({ success: true })
}
