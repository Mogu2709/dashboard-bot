import PageLayout from '@/components/PageLayout'
import PageHeader from '@/components/PageHeader'
import InfoBanner from '@/components/ui/InfoBanner'
import EmptyState from '@/components/ui/EmptyState'
import { supabase } from '@/lib/supabase'
import AbsensiActions from '@/components/AbsensiActions'
import { IconClipboard } from '@/components/icons'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getAbsensi() {
  const [sesiRes, detailRes, mahasiswaRes, activeRes] = await Promise.all([
    supabase.from('sesi_absensi').select('*').order('created_at', { ascending: false }),
    supabase.from('detail_absensi').select('*'),
    supabase.from('mahasiswa').select('*'),
    supabase.from('sesi_absensi').select('sesi_id, mata_kuliah, durasi_menit').eq('status', 'open').limit(1).maybeSingle(),
  ])
  return {
    sesi: sesiRes.data || [],
    detail: detailRes.data || [],
    totalMahasiswa: mahasiswaRes.data?.length || 0,
    activeSesi: activeRes.data || null,
  }
}

function barColor(p) {
  if (p >= 75) return '#10b981'
  if (p >= 50) return '#f59e0b'
  return '#ef4444'
}

export default async function AbsensiPage() {
  const { sesi, detail, totalMahasiswa, activeSesi } = await getAbsensi()

  return (
    <PageLayout>
      <PageHeader
        title="Absensi"
        description="Kelola sesi kehadiran kelas. Buka sesi → mahasiswa klik Hadir di Discord → tutup sesi untuk rekap."
        action={<AbsensiActions initialActiveSesi={activeSesi} />}
        badge={
          <span style={{ padding: '4px 10px', borderRadius: 8, background: '#1a1e2e', border: '1px solid #252a3a', fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>
            {sesi.length} sesi
          </span>
        }
      />

      <InfoBanner>
        <strong style={{ color: '#cbd5e1' }}>Cara kerja:</strong>{' '}
        1) Klik <strong style={{ color: '#cbd5e1' }}>Buka Sesi</strong> → bot kirim embed ke Discord →
        2) Mahasiswa klik <strong style={{ color: '#cbd5e1' }}>Hadir</strong> →
        3) Klik <strong style={{ color: '#cbd5e1' }}>Tutup Sesi</strong> untuk rekap.
      </InfoBanner>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>
        {sesi.length === 0 ? (
          <EmptyState
            icon={IconClipboard}
            title="Belum ada sesi absensi"
            description="Buka sesi absensi pertama untuk mulai mencatat kehadiran mahasiswa via Discord."
          />
        ) : sesi.map((s) => {
          const hadirList = detail.filter(d => d.sesi_id === s.sesi_id)
          const persentase = totalMahasiswa > 0 ? Math.round((hadirList.length / totalMahasiswa) * 100) : 0
          const color = barColor(persentase)
          const isOpen = s.status === 'open'

          return (
            <div key={s.id} className="card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #252a3a' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <h3 style={{ fontWeight: 600, color: '#f1f5f9', fontSize: 16, margin: 0 }}>{s.mata_kuliah}</h3>
                    {isOpen ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', fontSize: 11, fontWeight: 600 }}>
                        <span className="animate-pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
                        Aktif
                      </span>
                    ) : (
                      <span style={{ padding: '3px 10px', borderRadius: 20, background: '#1a1e2e', border: '1px solid #252a3a', color: '#64748b', fontSize: 11 }}>
                        Selesai
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#64748b' }}>
                    <span>{s.tanggal}</span>
                    <span>{s.waktu_mulai}</span>
                    <span>{s.durasi_menit} menit</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9' }}>
                    {hadirList.length}<span style={{ fontSize: 16, fontWeight: 400, color: '#64748b' }}>/{totalMahasiswa}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>mahasiswa hadir</div>
                </div>
              </div>

              <div style={{ padding: '12px 24px', background: '#1a1e2e', borderBottom: '1px solid #252a3a' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: '#64748b' }}>Tingkat kehadiran</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color }}>{persentase}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: '#252a3a', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${persentase}%`, background: color, borderRadius: 3 }} />
                </div>
              </div>

              <div style={{ padding: '16px 24px' }}>
                {hadirList.length === 0 ? (
                  <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>Tidak ada yang hadir pada sesi ini.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {hadirList.map((h) => (
                      <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, background: '#0b0d14', border: '1px solid #252a3a' }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #10b981, #0891b2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0,
                        }}>
                          {h.nama.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.nama}</div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>{h.nim} · {h.waktu_hadir}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </PageLayout>
  )
}
