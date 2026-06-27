import PageLayout from '@/components/PageLayout'
import PageHeader from '@/components/PageHeader'
import InfoBanner from '@/components/ui/InfoBanner'
import { supabase } from '@/lib/supabase'
import AbsensiActions from '@/components/AbsensiActions'
import AbsensiSesiAktif from '@/components/AbsensiSesiAktif'
import AbsensiRiwayat from '@/components/AbsensiRiwayat'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getAbsensi() {
  const [sesiRes, detailRes, mahasiswaRes] = await Promise.all([
    supabase.from('sesi_absensi').select('*').order('created_at', { ascending: false }),
    supabase.from('detail_absensi').select('*'),
    supabase.from('mahasiswa').select('*'),
  ])
  return {
    sesi: sesiRes.data || [],
    detail: detailRes.data || [],
    semuaMahasiswa: mahasiswaRes.data || [],
  }
}

export default async function AbsensiPage() {
  const { sesi, detail, semuaMahasiswa } = await getAbsensi()
  const sesiAktif = sesi.find(s => s.status === 'open') || null
  const riwayatSesi = sesi.filter(s => s.status !== 'open')

  return (
    <PageLayout>
      <PageHeader
        title="Absensi"
        description="Buka sesi, mahasiswa absen via Discord, lalu tutup sesi untuk rekap kehadiran."
        action={!sesiAktif && <AbsensiActions />}
      />

      {!sesiAktif && (
        <InfoBanner>
          <strong style={{ color: '#cbd5e1' }}>Cara kerja:</strong>{' '}
          1) Klik <strong style={{ color: '#cbd5e1' }}>Buka Sesi</strong> → bot kirim embed ke Discord →
          2) Mahasiswa klik <strong style={{ color: '#cbd5e1' }}>Hadir</strong> →
          3) Tutup sesi untuk menyimpan rekap kehadiran.
        </InfoBanner>
      )}

      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 28 }}>
        {sesiAktif && (
          <AbsensiSesiAktif
            sesi={sesiAktif}
            hadirList={detail.filter(d => d.sesi_id === sesiAktif.sesi_id)}
            semuaMahasiswa={semuaMahasiswa}
          />
        )}

        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 14 }}>
            Riwayat Sesi ({riwayatSesi.length})
          </div>
          <AbsensiRiwayat riwayatSesi={riwayatSesi} detail={detail} semuaMahasiswa={semuaMahasiswa} />
        </div>
      </div>
    </PageLayout>
  )
}
