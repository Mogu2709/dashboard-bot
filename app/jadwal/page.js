import PageLayout from '@/components/PageLayout'
import PageHeader from '@/components/PageHeader'
import InfoBanner from '@/components/ui/InfoBanner'
import { supabase } from '@/lib/supabase'
import JadwalActions from '@/components/JadwalActions'
import JadwalList from '@/components/JadwalList'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getJadwal() {
  const { data } = await supabase.from('jadwal').select('*').order('jam_mulai')
  return data || []
}

export default async function JadwalPage() {
  const semuaJadwal = await getJadwal()

  return (
    <PageLayout>
      <PageHeader
        title="Jadwal Kuliah"
        description="Atur jadwal mata kuliah per hari. Jadwal ditampilkan berkelompok berdasarkan hari kuliah."
        action={<JadwalActions mode="add" />}
      />

      <InfoBanner>
        Tambahkan jadwal dengan hari, mata kuliah, dosen, jam, dan ruangan.
        Kelas hari ini yang sudah lewat jam selesai akan otomatis tersembunyi secara real-time, dan muncul kembali minggu depan.
      </InfoBanner>

      <JadwalList semuaJadwal={semuaJadwal} />
    </PageLayout>
  )
}
