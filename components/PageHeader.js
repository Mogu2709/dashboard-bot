export default function PageHeader({ title, description, action, badge }) {
  return (
    <div className="page-header-row">
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4, flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{title}</h1>
          {badge}
        </div>
        {description && (
          <p style={{ color: '#64748b', fontSize: 14, margin: 0, lineHeight: 1.5, maxWidth: 520 }}>{description}</p>
        )}
      </div>
      {action && <div className="page-header-action">{action}</div>}
    </div>
  )
}
