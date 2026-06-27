import PageLayout from '@/components/PageLayout'
import PageHeader from '@/components/PageHeader'
import InfoBanner from '@/components/ui/InfoBanner'
import EmptyState from '@/components/ui/EmptyState'
import { supabase } from '@/lib/supabase'
import PengumumanActions from '@/components/PengumumanActions'
import { IconBell, IconClock } from '@/components/icons'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getPengumuman() {
  const { data } = await supabase
    .from('pengumuman')
    .select('*')
    .order('created_at', { ascending: false })
  return data || []
}

const TIPE_STYLE = {
  info:    { bg: 'rgba(99,102,241,0.1)',  border: 'rgba(99,102,241,0.25)',  color: '#818cf8',  label: 'Info' },
  penting: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)',   color: '#f87171',  label: '🔴 Penting' },
  acara:   { bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.25)', color: '#34d399',  label: '🗓️ Acara' },
}

export default async function PengumumanPage() {
  const pengumuman = await getPengumuman()

  return (
    <PageLayout>
      <PageHeader
        title="Pengumuman"
        description="Buat pengumuman dan kirim langsung ke channel Discord kelas."
        action={<PengumumanActions />}
        badge={
          <span style={{ padding: '4px 10px', borderRadius: 8, background: '#1a1e2e', border: '1px solid #252a3a', fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>
            {pengumuman.length} pengumuman
          </span>
        }
      />

      <InfoBanner>
        Pengumuman yang dibuat akan otomatis dikirim ke channel Discord via webhook.
        Pilih tipe pengumuman untuk menentukan warna embed di Discord.
      </InfoBanner>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
        {pengumuman.length === 0 ? (
          <EmptyState
            icon={IconBell}
            title="Belum ada pengumuman"
            description="Buat pengumuman pertama untuk mengirim informasi ke seluruh anggota kelas lewat Discord."
            action={<PengumumanActions />}
          />
        ) : pengumuman.map(p => {
          const style = TIPE_STYLE[p.tipe] || TIPE_STYLE.info
          return (
            <div key={p.id} className="card" style={{ padding: 24, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{
                padding: '6px 12px', borderRadius: 8, flexShrink: 0, marginTop: 2,
                background: style.bg, border: `1px solid ${style.border}`,
                fontSize: 12, fontWeight: 600, color: style.color,
              }}>
                {style.label}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontWeight: 600, color: '#f1f5f9', fontSize: 16, margin: '0 0 6px' }}>{p.judul}</h3>
                <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6, margin: '0 0 12px', whiteSpace: 'pre-wrap' }}>{p.isi}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
                  <IconClock style={{ width: 13, height: 13 }} />
                  {new Date(p.created_at).toLocaleString('id-ID', {
                    timeZone: 'Asia/Jakarta',
                    day: 'numeric', month: 'long', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })} WIB
                  {p.dikirim_discord && (
                    <span style={{ marginLeft: 8, padding: '2px 8px', borderRadius: 6, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399', fontSize: 11 }}>
                      ✓ Terkirim ke Discord
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </PageLayout>
  )
}
