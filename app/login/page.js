'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconGraduation } from '@/components/icons'
import Button from '@/components/ui/Button'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    const data = await res.json()

    if (data.success) {
      router.push('/')
      router.refresh()
    } else {
      setError(data.message)
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, background: '#0b0d14', position: 'relative',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.08), transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
            alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: 20,
            boxShadow: '0 8px 32px rgba(99,102,241,0.25)',
          }}>
            <IconGraduation style={{ width: 28, height: 28 }} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f1f5f9', margin: '0 0 8px' }}>Dashboard Kelas</h1>
          <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Masuk dengan password ketua kelas</p>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password dashboard"
                className="form-input"
                required
              />
            </div>

            {error && (
              <div style={{
                padding: '12px 16px', borderRadius: 12, marginBottom: 16,
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: 14,
              }}>
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} style={{ width: '100%' }} size="lg">
              {loading ? 'Memproses...' : 'Masuk ke Dashboard'}
            </Button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#64748b', marginTop: 24 }}>
          Panel khusus ketua kelas untuk mengelola absensi, tugas, dan jadwal.
        </p>
      </div>
    </div>
  )
}
