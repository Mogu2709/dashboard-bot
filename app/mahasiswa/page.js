import PageLayout from '@/components/PageLayout'
import PageHeader from '@/components/PageHeader'
import InfoBanner from '@/components/ui/InfoBanner'
import EmptyState from '@/components/ui/EmptyState'
import { supabase } from '@/lib/supabase'
import DeleteMahasiswa from '@/components/DeleteMahasiswa'
import { IconUsers } from '@/components/icons'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getMahasiswa() {
  const { data } = await supabase.from('mahasiswa').select('*').order('angkatan')
  return data || []
}

export default async function MahasiswaPage() {
  const mahasiswa = await getMahasiswa()
  const jurusan = [...new Set(mahasiswa.map(m => m.jurusan))]

  return (
    <PageLayout>
      <PageHeader
        title="Data Mahasiswa"
        description="Daftar anggota kelas yang terdaftar melalui bot Discord. Data otomatis tersinkron saat mahasiswa mendaftar."
        badge={
          <span style={{ padding: '4px 10px', borderRadius: 8, background: '#1a1e2e', border: '1px solid #252a3a', fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>
            {mahasiswa.length} terdaftar
          </span>
        }
      />

      <InfoBanner>
        Mahasiswa mendaftar lewat perintah <strong style={{ color: '#cbd5e1' }}>/daftar</strong> di Discord.
        Untuk menghapus data, gunakan tombol hapus di kolom aksi.
      </InfoBanner>

      {jurusan.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20, marginBottom: 24 }}>
          {jurusan.map(j => {
            const count = mahasiswa.filter(m => m.jurusan === j).length
            return (
              <div key={j} style={{ padding: '6px 12px', borderRadius: 8, background: '#141722', border: '1px solid #252a3a', fontSize: 12, color: '#94a3b8' }}>
                {j}: <span style={{ color: '#818cf8', fontWeight: 600 }}>{count}</span>
              </div>
            )
          })}
        </div>
      )}

      {mahasiswa.length === 0 ? (
        <EmptyState
          icon={IconUsers}
          title="Belum ada mahasiswa"
          description="Mahasiswa akan muncul di sini setelah mendaftar melalui bot Discord dengan perintah /daftar."
        />
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', minWidth: 640, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#1a1e2e', borderBottom: '1px solid #252a3a' }}>
                {['#', 'Mahasiswa', 'NIM', 'Jurusan', 'Angkatan', 'Discord', 'Aksi'].map((h) => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mahasiswa.map((m, i) => (
                <tr key={m.discord_id} className="table-row-hover" style={{ borderTop: '1px solid #252a3a' }}>
                  <td style={{ padding: '16px 20px', color: '#64748b', fontSize: 13 }}>{i + 1}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, fontWeight: 700, color: 'white', flexShrink: 0,
                      }}>
                        {m.nama.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ color: '#f1f5f9', fontWeight: 500, fontSize: 14 }}>{m.nama}</div>
                        <div style={{ color: '#64748b', fontSize: 12 }}>{m.jenis_kelamin}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8', fontSize: 13, fontFamily: 'monospace' }}>{m.nim}</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8', fontSize: 13 }}>{m.jurusan}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(99,102,241,0.15)', color: '#818cf8', fontSize: 12, fontWeight: 600 }}>
                      {m.angkatan}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#64748b', fontSize: 13 }}>@{m.discord_tag}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <DeleteMahasiswa discordId={m.discord_id} nama={m.nama} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageLayout>
  )
}
