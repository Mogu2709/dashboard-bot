'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { IconClock, IconTrash, IconEdit } from '@/components/icons'

const TIPE_OPTIONS = [
  { value: 'info',    label: '📢 Info',    desc: 'Informasi umum' },
  { value: 'penting', label: '🔴 Penting', desc: 'Ping @everyone di Discord' },
  { value: 'acara',   label: '🗓️ Acara',   desc: 'Event atau kegiatan kelas' },
]

const TIPE_STYLE = {
  info:    { bg: 'rgba(99,102,241,0.1)',   border: 'rgba(99,102,241,0.25)',  color: '#818cf8', label: '📢 Info' },
  penting: { bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.25)',   color: '#f87171', label: '🔴 Penting' },
  acara:   { bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.25)', color: '#34d399', label: '🗓️ Acara' },
}

export default function PengumumanCard({ p }) {
  const router = useRouter()
  const style = TIPE_STYLE[p.tipe] || TIPE_STYLE.info

  // Edit state
  const [showEdit, setShowEdit] = useState(false)
  const [editForm, setEditForm] = useState({ judul: p.judul, isi: p.isi, tipe: p.tipe })
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState('')

  // Delete state
  const [deleting, setDeleting] = useState(false)

  const handleEdit = async (e) => {
    e.preventDefault()
    setEditLoading(true)
    setEditError('')
    try {
      const res = await fetch('/api/pengumuman/edit', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p.id, ...editForm }),
      })
      const data = await res.json()
      if (!data.success) {
        setEditError(data.message || 'Gagal menyimpan perubahan')
        return
      }
      setShowEdit(false)
      router.refresh()
    } catch {
      setEditError('Gagal terhubung ke server. Coba lagi.')
    } finally {
      setEditLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Hapus pengumuman "${p.judul}"?`)) return
    setDeleting(true)
    try {
      const res = await fetch('/api/pengumuman/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p.id }),
      })
      const data = await res.json()
      if (!data.success) {
        alert(data.message || 'Gagal menghapus pengumuman')
        return
      }
      router.refresh()
    } catch {
      alert('Gagal terhubung ke server')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="card" style={{ padding: 24, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        {/* Badge tipe */}
        <div style={{
          padding: '6px 12px', borderRadius: 8, flexShrink: 0, marginTop: 2,
          background: style.bg, border: `1px solid ${style.border}`,
          fontSize: 12, fontWeight: 600, color: style.color,
        }}>
          {style.label}
        </div>

        {/* Konten */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontWeight: 600, color: '#f1f5f9', fontSize: 16, margin: '0 0 6px' }}>{p.judul}</h3>
          <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6, margin: '0 0 12px', whiteSpace: 'pre-wrap' }}>{p.isi}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b', flexWrap: 'wrap' }}>
            <IconClock style={{ width: 13, height: 13 }} />
            {new Date(p.created_at).toLocaleString('id-ID', {
              timeZone: 'Asia/Jakarta',
              day: 'numeric', month: 'long', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })} WIB
            {p.dikirim_discord && (
              <span style={{ marginLeft: 4, padding: '2px 8px', borderRadius: 6, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399', fontSize: 11 }}>
                ✓ Terkirim ke Discord
              </span>
            )}
          </div>
        </div>

        {/* Aksi */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setEditForm({ judul: p.judul, isi: p.isi, tipe: p.tipe }); setShowEdit(true) }}
          >
            <IconEdit size={14} />
            Edit
          </Button>
          <Button variant="ghost-danger" size="sm" onClick={handleDelete} disabled={deleting}>
            <IconTrash size={14} />
            {deleting ? 'Menghapus...' : 'Hapus'}
          </Button>
        </div>
      </div>

      {/* Modal Edit */}
      {showEdit && (
        <Modal
          title="Edit Pengumuman"
          description="Perubahan hanya tersimpan di dashboard, tidak dikirim ulang ke Discord."
          onClose={() => { setShowEdit(false); setEditError('') }}
        >
          <form onSubmit={handleEdit}>
            {/* Tipe */}
            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Tipe Pengumuman</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {TIPE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setEditForm({ ...editForm, tipe: opt.value })}
                    style={{
                      flex: 1, padding: '10px 8px', borderRadius: 10, border: '1px solid',
                      borderColor: editForm.tipe === opt.value ? '#6366f1' : '#252a3a',
                      background: editForm.tipe === opt.value ? 'rgba(99,102,241,0.12)' : '#0b0d14',
                      color: editForm.tipe === opt.value ? '#818cf8' : '#64748b',
                      cursor: 'pointer', fontSize: 12, fontWeight: 600,
                      fontFamily: 'inherit', textAlign: 'center', transition: 'all 0.15s',
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
                value={editForm.judul}
                onChange={e => setEditForm({ ...editForm, judul: e.target.value })}
                required
                className="form-input"
              />
            </div>

            {/* Isi */}
            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Isi Pengumuman</label>
              <textarea
                value={editForm.isi}
                onChange={e => setEditForm({ ...editForm, isi: e.target.value })}
                required
                rows={5}
                className="form-input"
                style={{ resize: 'vertical', minHeight: 100 }}
              />
            </div>

            {editError && (
              <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: 13, marginBottom: 14 }}>
                {editError}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <Button type="button" variant="ghost" style={{ flex: 1 }} onClick={() => { setShowEdit(false); setEditError('') }}>
                Batal
              </Button>
              <Button type="submit" style={{ flex: 1 }} disabled={editLoading}>
                {editLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
