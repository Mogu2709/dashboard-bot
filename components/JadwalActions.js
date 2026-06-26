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
  const [form, setForm] = useState({ hari: 'Senin', mata_kuliah: '', dosen: '', jam_mulai: '', jam_selesai: '', ruangan: '' })
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
    await fetch('/api/jadwal/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setShowForm(false)
    setLoading(false)
    setForm({ hari: 'Senin', mata_kuliah: '', dosen: '', jam_mulai: '', jam_selesai: '', ruangan: '' })
    router.refresh()
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
