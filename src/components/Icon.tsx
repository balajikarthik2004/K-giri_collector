type IconProps = {
  name: string
  className?: string
  filled?: boolean
  title?: string
}

/** Material Symbols glyph. Decorative by default. */
export function Icon({ name, className = '', filled = false, title }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
      aria-hidden={title ? undefined : true}
      title={title}
    >
      {name}
    </span>
  )
}
