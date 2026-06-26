import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata = {
  title: 'Dashboard Kelas',
  description: 'Panel manajemen kelas — absensi, tugas, jadwal, dan data mahasiswa',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={inter.variable}>
      <body style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif', minHeight: '100vh', margin: 0 }}>
        {children}
      </body>
    </html>
  )
}
