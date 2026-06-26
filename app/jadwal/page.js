import PageLayout from '@/components/PageLayout'
import PageHeader from '@/components/PageHeader'
import InfoBanner from '@/components/ui/InfoBanner'
import EmptyState from '@/components/ui/EmptyState'
import { supabase } from '@/lib/supabase'
import JadwalActions from '@/components/JadwalActions'
import { IconCalendar } from '@/components/icons'

const HARI_LIST = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

const WARNA_HARI = {
  Senin:  { dot: '#818cf8', text: '#a5b4fc', border: 'rgba(99,102,241,0.25)',  header: 'rgba(99,102,241,0.06)' },
  Selasa: { dot: '#34d399', text: '#6ee7b7', border: 'rgba(52,211,153,0.25)',  header: 'rgba(52,211,153,0.06)' },
  Rabu:   { dot: '#fbbf24', text: '#fcd34d', border: 'rgba(251,191,36,0.25)',  header: 'rgba(251,191,36,0.06)' },
  Kamis:  { dot: '#a78bfa', text: '#c4b5fd', border: 'rgba(167,139,250,0.25)', header: 'rgba(167,139,250,0.06)' },
  Jumat:  { dot: '#f87171', text: '#fca5a5', border: 'rgba(248,113,113,0.25)', header: 'rgba(248,113,113,0.06)' },
  Sabtu:  { dot: '#fb923c', text: '#fdba74', border: 'rgba(251,146,60,0.25)',  header: 'rgba(251,146,60,0.06)' },
}

async function getJadwal() {
  const { data } = await supabase.from('jadwal').select('*').order('jam_mulai')
  return data || []
}

export default async function JadwalPage() {
  const jadwal = await getJadwal()

  return (
    <PageLayout>
      <PageHeader
        title="Jadwal Kuliah"
        description="Atur jadwal mata kuliah per hari. Jadwal ditampilkan berkelompok berdasarkan hari kuliah."
        action={<JadwalActions mode="add" />}
        badge={
          <span style={{ padding: '4px 10px', borderRadius: 8, background: '#1a1e2e', border: '1px solid #252a3a', fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>
            {jadwal.length} mata kuliah
          </span>
        }
      />

      <InfoBanner>
        Tambahkan jadwal dengan hari, mata kuliah, dosen, jam, dan ruangan.
        Jadwal akan terorganisir otomatis per hari.
      </InfoBanner>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>
        {jadwal.length === 0 ? (
          <EmptyState
            icon={IconCalendar}
            title="Belum ada jadwal"
            description="Tambahkan jadwal kuliah pertama untuk mulai mengatur waktu perkuliahan kelas."
            action={<JadwalActions mode="add" />}
          />
        ) : HARI_LIST.map(hari => {
          const jadwalHari = jadwal.filter(j => j.hari === hari)
          if (jadwalHari.length === 0) return null
          const w = WARNA_HARI[hari]

          return (
            <div key={hari} style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${w.border}` }}>
              <div style={{ padding: '14px 20px', background: w.header, borderBottom: `1px solid ${w.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: w.dot }} />
                <span style={{ fontWeight: 700, color: w.text, fontSize: 15 }}>{hari}</span>
                <span style={{ fontSize: 12, color: '#64748b' }}>{jadwalHari.length} kelas</span>
              </div>

              <div style={{ background: '#141722' }}>
                {jadwalHari.map((j, idx) => (
                  <div key={j.id} style={{
                    padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 20,
                    borderTop: idx > 0 ? '1px solid #252a3a' : 'none',
                  }}>
                    <div style={{ textAlign: 'center', minWidth: 72, flexShrink: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', fontFamily: 'monospace' }}>{j.jam_mulai}</div>
                      <div style={{ fontSize: 10, color: '#64748b', margin: '2px 0' }}>s/d</div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#94a3b8', fontFamily: 'monospace' }}>{j.jam_selesai}</div>
                    </div>

                    <div style={{ width: 2, height: 40, background: w.dot, borderRadius: 1, opacity: 0.5, flexShrink: 0 }} />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', marginBottom: 4 }}>{j.mata_kuliah}</div>
                      <div style={{ fontSize: 13, color: '#64748b' }}>{j.dosen} · Ruang {j.ruangan}</div>
                    </div>

                    <JadwalActions mode="delete" jadwalId={j.id} matkul={j.mata_kuliah} />
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </PageLayout>
  )
}
