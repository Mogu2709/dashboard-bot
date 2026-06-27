import Link from 'next/link'
import PageLayout from '@/components/PageLayout'
import PageHeader from '@/components/PageHeader'
import AngkatanChart from '@/components/AngkatanChart'
import { supabase } from '@/lib/supabase'
import {
  IconUsers, IconTask, IconCalendar, IconClipboard, IconArrowRight,
} from '@/components/icons'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getStats() {
  const [mahasiswa, tugas, jadwal, absensi] = await Promise.all([
    supabase.from('mahasiswa').select('*'),
    supabase.from('tugas').select('*'),
    supabase.from('jadwal').select('*'),
    supabase.from('sesi_absensi').select('*'),
  ])
  return {
    totalMahasiswa: mahasiswa.data?.length || 0,
    totalTugas: tugas.data?.length || 0,
    totalJadwal: jadwal.data?.length || 0,
    totalAbsensi: absensi.data?.length || 0,
    mahasiswaData: mahasiswa.data || [],
  }
}

const statCards = [
  { label: 'Mahasiswa', desc: 'Anggota terdaftar', key: 'totalMahasiswa', href: '/mahasiswa', icon: IconUsers, accent: '#6366f1', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.2)' },
  { label: 'Tugas Aktif', desc: 'Tugas yang diumumkan', key: 'totalTugas', href: '/tugas', icon: IconTask, accent: '#22d3ee', bg: 'rgba(34,211,238,0.08)', border: 'rgba(34,211,238,0.2)' },
  { label: 'Jadwal Kuliah', desc: 'Mata kuliah terjadwal', key: 'totalJadwal', href: '/jadwal', icon: IconCalendar, accent: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)' },
  { label: 'Sesi Absensi', desc: 'Sesi pernah dibuka', key: 'totalAbsensi', href: '/absensi', icon: IconClipboard, accent: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)' },
]

const quickActions = [
  { label: 'Buka Absensi', href: '/absensi', desc: 'Mulai sesi kehadiran via Discord' },
  { label: 'Tambah Tugas', href: '/tugas', desc: 'Umumkan tugas baru ke kelas' },
  { label: 'Tambah Jadwal', href: '/jadwal', desc: 'Atur jadwal mata kuliah' },
]

export default async function OverviewPage() {
  const stats = await getStats()

  const angkatanCount = stats.mahasiswaData.reduce((acc, m) => {
    acc[m.angkatan] = (acc[m.angkatan] || 0) + 1
    return acc
  }, {})
  const chartData = Object.entries(angkatanCount)
    .map(([angkatan, jumlah]) => ({ angkatan, jumlah }))
    .sort((a, b) => a.angkatan.localeCompare(b.angkatan))

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <PageLayout>
      <PageHeader title="Overview" description={`Ringkasan data kelas — ${today}`} />

      {/* Stat Cards */}
      <div className="stat-cards-grid">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link key={card.key} href={card.href} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: 20, borderRadius: 16, background: card.bg,
                border: `1px solid ${card.border}`, cursor: 'pointer',
                transition: 'transform 0.15s',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ padding: 10, borderRadius: 12, background: 'rgba(0,0,0,0.2)', color: card.accent }}>
                    <Icon style={{ width: 20, height: 20 }} />
                  </div>
                  <IconArrowRight style={{ width: 16, height: 16, color: '#64748b' }} />
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>{stats[card.key]}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', marginTop: 6 }}>{card.label}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{card.desc}</div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="overview-bottom-grid">
        {/* Chart */}
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#f1f5f9', margin: '0 0 4px' }}>Distribusi per Angkatan</h2>
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 24px' }}>Jumlah mahasiswa terdaftar berdasarkan angkatan</p>
          <AngkatanChart data={chartData} />
        </div>

        {/* Quick Actions */}
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#f1f5f9', margin: '0 0 4px' }}>Aksi Cepat</h2>
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 20px' }}>Langsung ke fitur yang sering dipakai</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {quickActions.map((action) => (
              <Link key={action.href + action.label} href={action.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px', borderRadius: 12, background: '#1a1e2e',
                  border: '1px solid #252a3a', transition: 'border-color 0.15s',
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#f1f5f9' }}>{action.label}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{action.desc}</div>
                  </div>
                  <IconArrowRight style={{ width: 16, height: 16, color: '#64748b', flexShrink: 0 }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
