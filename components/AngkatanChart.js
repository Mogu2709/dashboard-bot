'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#4f46e5', '#7c3aed', '#8b5cf6']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: '#141722', border: '1px solid #252a3a', borderRadius: 10, padding: '10px 14px' }}>
        <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 4px' }}>Angkatan {label}</p>
        <p style={{ color: '#818cf8', fontSize: 18, fontWeight: 700, margin: 0 }}>{payload[0].value} mahasiswa</p>
      </div>
    )
  }
  return null
}

export default function AngkatanChart({ data }) {
  if (!data?.length) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 0', fontSize: 14, color: '#64748b' }}>
        Belum ada data mahasiswa untuk ditampilkan
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} barSize={40} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
        <XAxis dataKey="angkatan" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
        <Bar dataKey="jumlah" radius={[6, 6, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
