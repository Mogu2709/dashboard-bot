'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { IconPlus, IconTrash } from '@/components/icons'

export default function TugasActions({ mode, tugasId, judul }) {
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState({ mata_kuliah: '', judul: '', deskripsi: '', deadline: '', link_drive: '' })
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Hapus tugas "${judul}"?`)) return
    setDeleting(true)
    try {
      const res = await fetch('/api/tugas/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: tugasId }),
      })
      const data = await res.json()
      if (!data.success) {
        alert(data.message || 'Gagal menghapus tugas')
        return
      }
      router.refresh()
    } catch {
      alert('Gagal terhubung ke server')
    } finally {
      setDeleting(false)
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/tugas/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!data.success) {
        setError(data.message || 'Gagal menyimpan tugas')
        return
      }
      setShowForm(false)
      setForm({ mata_kuliah: '', judul: '', deskripsi: '', deadline: '', link_drive: '' })
      router.refresh()
    } catch {
      setError('Gagal terhubung ke server. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  if (mode === 'delete') {
    return (
      <Button variant="ghost-danger" size="sm" onClick={handleDelete} disabled={deleting}>
        <IconTrash style={{ width: 14, height: 14 }} />
        {deleting ? 'Menghapus...' : 'Hapus'}
      </Button>
    )
  }

  const fields = [
    { key: 'mata_kuliah', label: 'Mata Kuliah', placeholder: 'Pemrograman Web', required: true },
    { key: 'judul', label: 'Judul Tugas', placeholder: 'Tugas 1 — HTML Dasar', required: true },
    { key: 'deskripsi', label: 'Deskripsi', placeholder: 'Jelaskan detail tugas...', required: true },
    { key: 'deadline', label: 'Deadline', placeholder: '30 Juni 2025, 23:59 WIB', required: true },
    { key: 'link_drive', label: 'Link Drive (opsional)', placeholder: 'https://drive.google.com/...', required: false },
  ]

  return (
    <>
      <Button onClick={() => setShowForm(true)}>
        <IconPlus style={{ width: 16, height: 16 }} />
        Tambah Tugas
      </Button>

      {showForm && (
        <Modal
          title="Tambah Tugas Baru"
          description="Isi detail tugas yang akan diumumkan ke kelas."
          onClose={() => { setShowForm(false); setError('') }}
        >
          <form onSubmit={handleAdd}>
            {fields.map(({ key, label, placeholder, required }) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label className="form-label">{label}</label>
                <input
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  required={required}
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
              <Button type="button" variant="ghost" style={{ flex: 1 }} onClick={() => { setShowForm(false); setError('') }}>Batal</Button>
              <Button type="submit" style={{ flex: 1 }} disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan Tugas'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
