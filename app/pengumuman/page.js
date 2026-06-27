import PageLayout from '@/components/PageLayout'
import PageHeader from '@/components/PageHeader'
import InfoBanner from '@/components/ui/InfoBanner'
import EmptyState from '@/components/ui/EmptyState'
import { supabase } from '@/lib/supabase'
import PengumumanActions from '@/components/PengumumanActions'
import PengumumanCard from '@/components/PengumumanCard'
import { IconBell } from '@/components/icons'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getPengumuman() {
  const { data } = await supabase
    .from('pengumuman')
    .select('*')
    .order('created_at', { ascending: false })
  return data || []
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
        Edit hanya mengubah data di dashboard — tidak dikirim ulang ke Discord.
      </InfoBanner>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
        {pengumuman.length === 0 ? (
          <EmptyState
            icon={IconBell}
            title="Belum ada pengumuman"
            description="Buat pengumuman pertama untuk mengirim informasi ke seluruh anggota kelas lewat Discord."
            action={<PengumumanActions />}
          />
        ) : pengumuman.map(p => (
          <PengumumanCard key={p.id} p={p} />
        ))}
      </div>
    </PageLayout>
  )
}
