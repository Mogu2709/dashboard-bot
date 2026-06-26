import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function DELETE(request) {
  const { discord_id } = await request.json()
  await supabase.from('mahasiswa').delete().eq('discord_id', discord_id)
  return NextResponse.json({ success: true })
}

