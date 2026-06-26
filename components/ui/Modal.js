'use client'
import { IconX } from '@/components/icons'

export default function Modal({ title, description, children, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{title}</h2>
            {description && (
              <p style={{ marginTop: 6, fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{ padding: 6, borderRadius: 8, background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
          >
            <IconX size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
