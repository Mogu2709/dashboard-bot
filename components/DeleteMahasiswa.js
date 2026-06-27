'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { IconTrash } from '@/components/icons'

export default function DeleteMahasiswa({ discordId, nama }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Hapus data ${nama} dari database?`)) return
    setLoading(true)
    try {
      const res = await fetch('/api/mahasiswa/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discord_id: discordId }),
      })
      const data = await res.json()
      if (!data.success) {
        alert(data.message || 'Gagal menghapus data mahasiswa')
        return
      }
      router.refresh()
    } catch {
      alert('Gagal terhubung ke server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="ghost-danger" size="sm" onClick={handleDelete} disabled={loading}>
      <IconTrash size={14} />
      {loading ? 'Menghapus...' : 'Hapus'}
    </Button>
  )
}
