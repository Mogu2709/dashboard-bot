'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { IconLock, IconClock, IconCheck, IconUserX } from '@/components/icons'

function hitungSisaDetik(waktuMulai, tanggal, durasiMenit) {
  // waktuMulai format "HH:MM:SS", tanggal format "YYYY-MM-DD" — keduanya berbasis WIB.
  const mulaiUTC = new Date(`${tanggal}T${waktuMulai}+07:00`).getTime()
  const selesaiUTC = mulaiUTC + durasiMenit * 60 * 1000
  return Math.round((selesaiUTC - Date.now()) / 1000)
}

function formatSisaWaktu(detik) {
  if (detik <= 0) return 'Waktu habis'
  const m = Math.floor(detik / 60)
  const s = detik % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function AbsensiSesiAktif({ sesi, hadirList, semuaMahasiswa }) {
  const [sisaDetik, setSisaDetik] = useState(() =>
    hitungSisaDetik(sesi.waktu_mulai, sesi.tanggal, sesi.durasi_menit)
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      setSisaDetik(hitungSisaDetik(sesi.waktu_mulai, sesi.tanggal, sesi.durasi_menit))
    }, 1000)
    return () => clearInterval(interval)
  }, [sesi.waktu_mulai, sesi.tanggal, sesi.durasi_menit])

  const hadirNims = new Set(hadirList.map(h => h.nim))
  const belumHadir = semuaMahasiswa.filter(m => !hadirNims.has(m.nim))
  const persentase = semuaMahasiswa.length > 0
    ? Math.round((hadirList.length / semuaMahasiswa.length) * 100)
    : 0
  const waktuHabis = sisaDetik <= 0

  const handleTutup = async () => {
    if (!confirm(`Tutup sesi absensi "${sesi.mata_kuliah}"?`)) return
    setLoading(true)
    setError('')

    const res = await fetch('/api/absensi/tutup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sesi_id: sesi.sesi_id, mata_kuliah: sesi.mata_kuliah }),
    })
    const data = await res.json()

    if (!data.success) {
      setError(data.message || 'Gagal menutup sesi absensi')
      setLoading(false)
      return
    }
    router.refresh()
  }

  return (
    <div className="absensi-active-card">
      <div className="absensi-active-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="live-dot" />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Sesi Berlangsung
          </span>
        </div>
        <div className={`countdown-pill${waktuHabis ? ' expired' : ''}`}>
          <IconClock size={14} />
          {formatSisaWaktu(sisaDetik)}
        </div>
      </div>

      <div className="absensi-active-body">
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', margin: '0 0 6px' }}>{sesi.mata_kuliah}</h2>
          <div style={{ fontSize: 13, color: '#94a3b8' }}>
            Dibuka {sesi.waktu_mulai?.slice(0, 5)} WIB · durasi {sesi.durasi_menit} menit
          </div>
        </div>

        <div className="absensi-stat-row">
          <div className="absensi-stat-box hadir">
            <IconCheck size={18} />
            <div>
              <div className="absensi-stat-number">{hadirList.length}</div>
              <div className="absensi-stat-label">Sudah hadir</div>
            </div>
          </div>
          <div className="absensi-stat-box belum">
            <IconUserX size={18} />
            <div>
              <div className="absensi-stat-number">{belumHadir.length}</div>
              <div className="absensi-stat-label">Belum hadir</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: '#64748b' }}>Tingkat kehadiran</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#34d399' }}>{persentase}%</span>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: '#252a3a', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${persentase}%`, background: 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: 4, transition: 'width 0.4s ease' }} />
          </div>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: 13 }}>
            {error}
          </div>
        )}

        <Button variant="danger" onClick={handleTutup} disabled={loading} style={{ width: '100%' }}>
          <IconLock size={16} />
          {loading ? 'Menutup sesi...' : 'Tutup Sesi & Rekap Kehadiran'}
        </Button>

        {belumHadir.length > 0 && (
          <details className="absensi-belum-hadir-details">
            <summary>Lihat {belumHadir.length} mahasiswa yang belum hadir</summary>
            <div className="absensi-mahasiswa-grid">
              {belumHadir.map(m => (
                <div key={m.nim} className="absensi-mahasiswa-chip belum">
                  <div className="absensi-avatar belum">{m.nama.charAt(0).toUpperCase()}</div>
                  <div style={{ minWidth: 0 }}>
                    <div className="absensi-mahasiswa-nama">{m.nama}</div>
                    <div className="absensi-mahasiswa-nim">{m.nim}</div>
                  </div>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  )
}
