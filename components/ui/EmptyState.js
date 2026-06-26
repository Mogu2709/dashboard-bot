export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 24px', textAlign: 'center' }}>
      {Icon && (
        <div style={{
          width: 56, height: 56, borderRadius: 16, background: '#1a1e2e',
          border: '1px solid #252a3a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
        }}>
          <Icon style={{ width: 28, height: 28, color: '#64748b' }} />
        </div>
      )}
      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#f1f5f9', margin: '0 0 6px' }}>{title}</h3>
      {description && <p style={{ fontSize: 14, color: '#64748b', margin: 0, maxWidth: 360 }}>{description}</p>}
      {action && <div style={{ marginTop: 20 }}>{action}</div>}
    </div>
  )
}
