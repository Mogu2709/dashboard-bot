import PageLayout from '@/components/PageLayout'
import PageHeader from '@/components/PageHeader'
import InfoBanner from '@/components/ui/InfoBanner'
import EmptyState from '@/components/ui/EmptyState'
import { supabase } from '@/lib/supabase'
import TugasActions from '@/components/TugasActions'
import { IconTask, IconClock, IconExternalLink } from '@/components/icons'

async function getTugas() {
  const { data } = await supabase.from('tugas').select('*').order('created_at', { ascending: false })
  return data || []
}

export default async function TugasPage() {
  const tugas = await getTugas()

  return (
    <PageLayout>
      <PageHeader
        title="Tugas"
        description="Kelola dan umumkan tugas kelas. Setiap tugas yang ditambahkan akan tersimpan dan bisa dilihat mahasiswa."
        action={<TugasActions mode="add" />}
        badge={
          <span style={{ padding: '4px 10px', borderRadius: 8, background: '#1a1e2e', border: '1px solid #252a3a', fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>
            {tugas.length} tugas
          </span>
        }
      />

      <InfoBanner>
        Tambahkan tugas dengan mata kuliah, judul, deskripsi, deadline, dan link pengumpulan (opsional).
        Mahasiswa bisa melihat detail tugas melalui bot Discord.
      </InfoBanner>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
        {tugas.length === 0 ? (
          <EmptyState
            icon={IconTask}
            title="Belum ada tugas"
            description="Tambahkan tugas pertama untuk mengumumkan pekerjaan rumah atau proyek ke kelas."
            action={<TugasActions mode="add" />}
          />
        ) : tugas.map((t) => (
          <div key={t.id} className="card" style={{ padding: 24, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: '#818cf8',
            }}>
              #{t.id}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ padding: '3px 10px', borderRadius: 6, background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', color: '#38bdf8', fontSize: 12, fontWeight: 500 }}>
                {t.mata_kuliah}
              </span>
              <h3 style={{ fontWeight: 600, color: '#f1f5f9', fontSize: 16, margin: '8px 0 6px' }}>{t.judul}</h3>
              <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.5, margin: '0 0 12px' }}>{t.deskripsi}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#94a3b8' }}>
                  <IconClock style={{ width: 14, height: 14, color: '#fbbf24' }} />
                  Deadline: <span style={{ color: '#fbbf24', fontWeight: 500 }}>{t.deadline}</span>
                </span>
                {t.link_drive && (
                  <a href={t.link_drive} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#818cf8', textDecoration: 'none' }}>
                    <IconExternalLink style={{ width: 14, height: 14 }} />
                    Link Pengumpulan
                  </a>
                )}
              </div>
            </div>

            <TugasActions mode="delete" tugasId={t.id} judul={t.judul} />
          </div>
        ))}
      </div>
    </PageLayout>
  )
}
