'use client'
import { useState } from 'react'
import EmptyState from '@/components/ui/EmptyState'
import { IconClipboard, IconChevronDown, IconCheck, IconUserX, IconDownload } from '@/components/icons'

function barColor(p) {
  if (p >= 75) return '#10b981'
  if (p >= 50) return '#f59e0b'
  return '#ef4444'
}

function formatTanggal(tanggal) {
  return new Date(tanggal + 'T00:00:00').toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function exportCSV(sesi, hadirList, belumHadir) {
  const rows = [
    ['Status', 'Nama', 'NIM', 'Waktu Hadir'],
    ...hadirList.map(h => ['Hadir', h.nama, h.nim, h.waktu_hadir || '-']),
    ...belumHadir.map(m => ['Tidak Hadir', m.nama, m.nim, '-']),
  ]
  const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `absensi_${sesi.mata_kuliah.replace(/\s+/g, '_')}_${sesi.tanggal}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function SesiCard({ sesi, hadirList, semuaMahasiswa }) {
  const [expanded, setExpanded] = useState(false)
  const hadirNims = new Set(hadirList.map(h => h.nim))
  const belumHadir = semuaMahasiswa.filter(m => !hadirNims.has(m.nim))
  const persentase = semuaMahasiswa.length > 0
    ? Math.round((hadirList.length / semuaMahasiswa.length) * 100)
    : 0
  const color = barColor(persentase)

  return (
    <div className="riwayat-sesi-card">
      <button className="riwayat-sesi-summary" onClick={() => setExpanded(e => !e)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
          <div style={{ minWidth: 0, textAlign: 'left' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {sesi.mata_kuliah}
            </div>
            <div style={{ fontSize: 12, color: '#64748b' }}>{sesi.waktu_mulai?.slice(0, 5)} WIB · {sesi.durasi_menit} menit</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>
              {hadirList.length}<span style={{ color: '#64748b', fontWeight: 400 }}>/{semuaMahasiswa.length}</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color }}>{persentase}%</div>
          </div>
          <button
            onClick={e => { e.stopPropagation(); exportCSV(sesi, hadirList, belumHadir) }}
            title="Export CSV"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '5px 10px', borderRadius: 8, border: '1px solid #252a3a',
              background: 'transparent', color: '#64748b', fontSize: 12,
              fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
              transition: 'color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#818cf8'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#252a3a' }}
          >
            <IconDownload size={13} />
            CSV
          </button>
          <IconChevronDown size={16} style={{ color: '#64748b', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
        </div>
      </button>

      {expanded && (
        <div className="riwayat-sesi-detail">
          <div className="absensi-mahasiswa-grid">
            {hadirList.map(h => (
              <div key={h.id} className="absensi-mahasiswa-chip hadir">
                <div className="absensi-avatar hadir">{h.nama.charAt(0).toUpperCase()}</div>
                <div style={{ minWidth: 0 }}>
                  <div className="absensi-mahasiswa-nama">{h.nama}</div>
                  <div className="absensi-mahasiswa-nim">{h.nim} · {h.waktu_hadir}</div>
                </div>
                <IconCheck size={14} style={{ marginLeft: 'auto', color: '#34d399', flexShrink: 0 }} />
              </div>
            ))}
            {belumHadir.map(m => (
              <div key={m.nim} className="absensi-mahasiswa-chip belum">
                <div className="absensi-avatar belum">{m.nama.charAt(0).toUpperCase()}</div>
                <div style={{ minWidth: 0 }}>
                  <div className="absensi-mahasiswa-nama">{m.nama}</div>
                  <div className="absensi-mahasiswa-nim">{m.nim}</div>
                </div>
                <IconUserX size={14} style={{ marginLeft: 'auto', color: '#f87171', flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function AbsensiRiwayat({ riwayatSesi, detail, semuaMahasiswa }) {
  if (riwayatSesi.length === 0) {
    return (
      <EmptyState
        icon={IconClipboard}
        title="Belum ada riwayat sesi"
        description="Riwayat sesi absensi yang sudah ditutup akan muncul di sini."
      />
    )
  }

  const grouped = riwayatSesi.reduce((acc, s) => {
    acc[s.tanggal] = acc[s.tanggal] || []
    acc[s.tanggal].push(s)
    return acc
  }, {})
  const tanggalList = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {tanggalList.map(tanggal => (
        <div key={tanggal}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 10, paddingLeft: 4 }}>
            {formatTanggal(tanggal)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {grouped[tanggal].map(s => (
              <SesiCard
                key={s.id}
                sesi={s}
                hadirList={detail.filter(d => d.sesi_id === s.sesi_id)}
                semuaMahasiswa={semuaMahasiswa}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
