const variants = {
  primary: 'btn-primary',
  success: 'btn-success',
  danger: 'btn-danger',
  ghost: 'btn-ghost',
  'ghost-danger': 'btn-ghost-danger',
  outline: 'btn-ghost',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  type = 'button',
  style,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`btn ${variants[variant]}${size === 'sm' ? ' btn-sm' : ''} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </button>
  )
}
