'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { IconPlus, IconLock } from '@/components/icons'

export default function AbsensiActions({ initialActiveSesi = null }) {
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sesiAktif, setSesiAktif] = useState(initialActiveSesi)
  const [form, setForm] = useState({ mata_kuliah: '', durasi: 10 })
  const router = useRouter()

  const handleBuka = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/absensi/buka', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()

    if (!data.success) {
      setError(data.message || 'Gagal membuka sesi absensi')
      if (data.activeSesi) {
        setSesiAktif(data.activeSesi)
        setShowForm(false)
      }
      setLoading(false)
      return
    }

    setSesiAktif({
      sesi_id: data.sesi_id,
      mata_kuliah: data.mata_kuliah,
      durasi_menit: data.durasi,
    })
    setShowForm(false)
    setLoading(false)
    router.refresh()
  }

  const handleTutup = async () => {
    if (!confirm(`Tutup sesi absensi ${sesiAktif.mata_kuliah}?`)) return
    setLoading(true)
    setError('')

    const res = await fetch('/api/absensi/tutup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sesi_id: sesiAktif.sesi_id,
        mata_kuliah: sesiAktif.mata_kuliah,
      }),
    })
    const data = await res.json()

    if (!data.success) {
      setError(data.message || 'Gagal menutup sesi absensi')
      setLoading(false)
      return
    }

    setSesiAktif(null)
    setLoading(false)
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
      {error && (
        <div style={{
          padding: '10px 14px', borderRadius: 10, maxWidth: 280, textAlign: 'right',
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: 12,
        }}>
          {error}
        </div>
      )}

      {sesiAktif ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 10,
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
          }}>
            <span className="animate-pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
            <span style={{ fontSize: 12, fontWeight: 500, color: '#34d399' }}>
              {sesiAktif.mata_kuliah} · {sesiAktif.durasi_menit} menit
            </span>
          </div>
          <Button variant="danger" size="sm" onClick={handleTutup} disabled={loading}>
            <IconLock style={{ width: 14, height: 14 }} />
            {loading ? 'Menutup...' : 'Tutup Sesi'}
          </Button>
        </div>
      ) : (
        <Button variant="success" onClick={() => setShowForm(true)}>
          <IconPlus style={{ width: 16, height: 16 }} />
          Buka Sesi Absensi
        </Button>
      )}

      {showForm && (
        <Modal
          title="Buka Sesi Absensi"
          description="Bot Discord akan mengirim embed dengan tombol Hadir ke channel absensi."
          onClose={() => setShowForm(false)}
        >
          <form onSubmit={handleBuka}>
            <div style={{ marginBottom: 14 }}>
              <label className="form-label">Mata Kuliah</label>
              <input
                value={form.mata_kuliah}
                onChange={e => setForm({ ...form, mata_kuliah: e.target.value })}
                placeholder="Contoh: Matematika Diskrit"
                required
                className="form-input"
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="form-label">
                Durasi Sesi: <span style={{ color: '#818cf8', fontWeight: 700 }}>{form.durasi} menit</span>
              </label>
              <input
                type="range" min="5" max="60" step="5"
                value={form.durasi}
                onChange={e => setForm({ ...form, durasi: parseInt(e.target.value) })}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', marginTop: 4 }}>
                <span>5 menit</span>
                <span>60 menit</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Button type="button" variant="ghost" style={{ flex: 1 }} onClick={() => setShowForm(false)}>Batal</Button>
              <Button type="submit" variant="success" style={{ flex: 1 }} disabled={loading}>
                {loading ? 'Membuka...' : 'Buka Sesi'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
