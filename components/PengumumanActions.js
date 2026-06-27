'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { IconPlus } from '@/components/icons'

const TIPE_OPTIONS = [
  { value: 'info',    label: '📢 Info',       desc: 'Informasi umum' },
  { value: 'penting', label: '🔴 Penting',    desc: 'Ping @everyone di Discord' },
  { value: 'acara',   label: '🗓️ Acara',      desc: 'Event atau kegiatan kelas' },
]

export default function PengumumanActions() {
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [warning, setWarning] = useState('')
  const [form, setForm] = useState({ judul: '', isi: '', tipe: 'info' })
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setWarning('')

    try {
      const res = await fetch('/api/pengumuman/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!data.success) {
        setError(data.message || 'Gagal menyimpan pengumuman')
        return
      }

      if (data.warning) {
        setWarning(data.warning)
        // Tetap refresh — data sudah tersimpan
        setTimeout(() => {
          setShowForm(false)
          setForm({ judul: '', isi: '', tipe: 'info' })
          setWarning('')
          router.refresh()
        }, 2500)
        return
      }

      setShowForm(false)
      setForm({ judul: '', isi: '', tipe: 'info' })
      router.refresh()
    } catch {
      setError('Gagal terhubung ke server. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setShowForm(true)}>
        <IconPlus style={{ width: 16, height: 16 }} />
        Buat Pengumuman
      </Button>

      {showForm && (
        <Modal
          title="Buat Pengumuman Baru"
          description="Pengumuman akan dikirim ke channel Discord kelas secara otomatis."
          onClose={() => { setShowForm(false); setError(''); setWarning('') }}
        >
          <form onSubmit={handleSubmit}>
            {/* Tipe */}
            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Tipe Pengumuman</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {TIPE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, tipe: opt.value })}
                    style={{
                      flex: 1, padding: '10px 8px', borderRadius: 10, border: '1px solid',
                      borderColor: form.tipe === opt.value ? '#6366f1' : '#252a3a',
                      background: form.tipe === opt.value ? 'rgba(99,102,241,0.12)' : '#0b0d14',
                      color: form.tipe === opt.value ? '#818cf8' : '#64748b',
                      cursor: 'pointer', fontSize: 12, fontWeight: 600,
                      fontFamily: 'inherit', textAlign: 'center',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div>{opt.label}</div>
                    <div style={{ fontSize: 10, fontWeight: 400, marginTop: 2, opacity: 0.7 }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Judul */}
            <div style={{ marginBottom: 14 }}>
              <label className="form-label">Judul</label>
              <input
                value={form.judul}
                onChange={e => setForm({ ...form, judul: e.target.value })}
                placeholder="Contoh: Perubahan jadwal minggu ini"
                required
                className="form-input"
              />
            </div>

            {/* Isi */}
            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Isi Pengumuman</label>
              <textarea
                value={form.isi}
                onChange={e => setForm({ ...form, isi: e.target.value })}
                placeholder="Tulis isi pengumuman di sini..."
                required
                rows={5}
                className="form-input"
                style={{ resize: 'vertical', minHeight: 100 }}
              />
            </div>

            {error && (
              <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: 13, marginBottom: 14 }}>
                {error}
              </div>
            )}

            {warning && (
              <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)', color: '#fbbf24', fontSize: 13, marginBottom: 14 }}>
                ⚠️ {warning}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <Button type="button" variant="ghost" style={{ flex: 1 }} onClick={() => { setShowForm(false); setError(''); setWarning('') }}>
                Batal
              </Button>
              <Button type="submit" style={{ flex: 1 }} disabled={loading}>
                {loading ? 'Mengirim...' : '📢 Kirim Pengumuman'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
