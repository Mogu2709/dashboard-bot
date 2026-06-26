'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { IconPlus, IconTrash } from '@/components/icons'

const HARI_LIST = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

export default function JadwalActions({ mode, jadwalId, matkul }) {
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ hari: 'Senin', tanggal: '', mata_kuliah: '', dosen: '', jam_mulai: '', jam_selesai: '', ruangan: '' })
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Hapus jadwal "${matkul}"?`)) return
    await fetch('/api/jadwal/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: jadwalId }),
    })
    router.refresh()
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/jadwal/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const result = await res.json()

      if (!result.success) {
        setError(result.message || 'Gagal menyimpan jadwal')
        setLoading(false)
        return
      }

      setShowForm(false)
      setForm({ hari: 'Senin', tanggal: '', mata_kuliah: '', dosen: '', jam_mulai: '', jam_selesai: '', ruangan: '' })
      router.refresh()
    } catch (err) {
      setError('Gagal terhubung ke server. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  if (mode === 'delete') {
    return (
      <Button variant="ghost-danger" size="sm" onClick={handleDelete}>
        <IconTrash style={{ width: 14, height: 14 }} />
        Hapus
      </Button>
    )
  }

  const fields = [
    { key: 'mata_kuliah', label: 'Mata Kuliah', placeholder: 'Pemrograman Web' },
    { key: 'dosen', label: 'Dosen', placeholder: 'Dr. Budi Santoso' },
    { key: 'jam_mulai', label: 'Jam Mulai', placeholder: '08:00' },
    { key: 'jam_selesai', label: 'Jam Selesai', placeholder: '10:00' },
    { key: 'ruangan', label: 'Ruangan', placeholder: 'Lab Komputer 1' },
  ]

  return (
    <>
      <Button onClick={() => setShowForm(true)}>
        <IconPlus style={{ width: 16, height: 16 }} />
        Tambah Jadwal
      </Button>

      {showForm && (
        <Modal
          title="Tambah Jadwal Baru"
          description="Atur jadwal mata kuliah untuk hari tertentu."
          onClose={() => setShowForm(false)}
        >
          <form onSubmit={handleAdd}>
            <div style={{ marginBottom: 14 }}>
              <label className="form-label">Hari</label>
              <select
                value={form.hari}
                onChange={e => setForm({ ...form, hari: e.target.value })}
                className="form-input"
              >
                {HARI_LIST.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="form-label">Tanggal (opsional)</label>
              <input
                type="date"
                value={form.tanggal}
                onChange={e => setForm({ ...form, tanggal: e.target.value })}
                className="form-input"
              />
            </div>

            {fields.map(({ key, label, placeholder }) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label className="form-label">{label}</label>
                <input
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  required
                  className="form-input"
                />
              </div>
            ))}

            {error && (
              <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: 13, marginBottom: 14 }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <Button type="button" variant="ghost" style={{ flex: 1 }} onClick={() => setShowForm(false)}>Batal</Button>
              <Button type="submit" style={{ flex: 1 }} disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan Jadwal'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
