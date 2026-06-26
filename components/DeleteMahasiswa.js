'use client'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { IconTrash } from '@/components/icons'

export default function DeleteMahasiswa({ discordId, nama }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Hapus data ${nama} dari database?`)) return
    await fetch('/api/mahasiswa/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ discord_id: discordId }),
    })
    router.refresh()
  }

  return (
    <Button variant="ghost-danger" size="sm" onClick={handleDelete}>
      <IconTrash size={14} />
      Hapus
    </Button>
  )
}
