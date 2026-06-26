'use client'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { IconMenu, IconGraduation } from '@/components/icons'

export default function PageLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div className="app-topbar">
          <button
            className="hamburger-btn"
            aria-label="Buka menu"
            onClick={() => setSidebarOpen(true)}
          >
            <IconMenu size={22} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconGraduation size={18} style={{ color: '#818cf8' }} />
            <span style={{ fontWeight: 700, fontSize: 14, color: '#f1f5f9' }}>Dashboard Kelas</span>
          </div>
          <div style={{ width: 30 }} />
        </div>

        <main className="app-main">
          {children}
        </main>
      </div>
    </div>
  )
}
