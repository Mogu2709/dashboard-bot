import { IconInfo } from '@/components/icons'

export default function InfoBanner({ children }) {
  return (
    <div className="info-banner">
      <IconInfo size={18} style={{ color: '#818cf8', flexShrink: 0, marginTop: 2 }} />
      <div>{children}</div>
    </div>
  )
}
