'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  IconOverview, IconUsers, IconClipboard, IconTask,
  IconCalendar, IconLogout, IconGraduation, IconX, IconBell,
} from '@/components/icons'

const menus = [
  { href: '/',             icon: IconOverview,  label: 'Overview',      desc: 'Ringkasan kelas' },
  { href: '/mahasiswa',    icon: IconUsers,     label: 'Mahasiswa',     desc: 'Data anggota' },
  { href: '/absensi',      icon: IconClipboard, label: 'Absensi',       desc: 'Sesi kehadiran' },
  { href: '/tugas',        icon: IconTask,      label: 'Tugas',         desc: 'Kelola tugas' },
  { href: '/jadwal',       icon: IconCalendar,  label: 'Jadwal',        desc: 'Jadwal kuliah' },
  { href: '/pengumuman',   icon: IconBell,      label: 'Pengumuman',    desc: 'Kirim ke Discord' },
]

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      <div
        className={`app-sidebar-overlay${open ? ' open' : ''}`}
        onClick={onClose}
      />
      <aside className={`app-sidebar${open ? ' open' : ''}`}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #252a3a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
            }}>
              <IconGraduation size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 14 }}>Dashboard Kelas</div>
              <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>Panel Ketua Kelas</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="sidebar-close-btn"
            aria-label="Tutup menu"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
          <p style={{ padding: '0 12px', marginBottom: 8, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b' }}>
            Menu
          </p>
          {menus.map((menu) => {
            const isActive = pathname === menu.href
            const Icon = menu.icon
            return (
              <Link
                key={menu.href}
                href={menu.href}
                className={`nav-link${isActive ? ' active' : ''}`}
                onClick={onClose}
              >
                <Icon size={20} style={{ flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: isActive ? 600 : 500, lineHeight: 1.3 }}>{menu.label}</div>
                  <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.3 }}>{menu.desc}</div>
                </div>
                {isActive && (
                  <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#818cf8', flexShrink: 0 }} />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid #252a3a' }}>
          <button
            onClick={handleLogout}
            className="btn btn-ghost-danger"
            style={{ width: '100%' }}
          >
            <IconLogout size={18} />
            Keluar
          </button>
        </div>
      </aside>
    </>
  )
}
