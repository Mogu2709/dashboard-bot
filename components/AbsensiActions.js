'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { IconPlus } from '@/components/icons'

export default function AbsensiActions() {
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
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
      setLoading(false)
      return
    }

    setShowForm(false)
    setLoading(false)
    setForm({ mata_kuliah: '', durasi: 10 })
    router.refresh()
  }

  return (
    <>
      <Button variant="success" onClick={() => setShowForm(true)}>
        <IconPlus style={{ width: 16, height: 16 }} />
        Buka Sesi Absensi
      </Button>

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

            {error && (
              <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: 13, marginBottom: 14 }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <Button type="button" variant="ghost" style={{ flex: 1 }} onClick={() => setShowForm(false)}>Batal</Button>
              <Button type="submit" variant="success" style={{ flex: 1 }} disabled={loading}>
                {loading ? 'Membuka...' : 'Buka Sesi'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
