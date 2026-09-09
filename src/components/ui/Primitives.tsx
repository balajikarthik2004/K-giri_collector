import type { ReactNode } from 'react'
import { Icon } from '../Icon'
import { useI18n, type Bi } from '../../i18n'

/* ------------------------------------------------------------------ *
 * Panel — the single surface every block of content sits on.
 * ------------------------------------------------------------------ */

export function Panel({
  children,
  className = '',
  pad = true,
}: {
  children: ReactNode
  className?: string
  pad?: boolean
}) {
  return (
    <section
      data-print="page"
      className={`card min-w-0 ${pad ? 'p-4 sm:p-5' : ''} ${className}`}
    >
      {children}
    </section>
  )
}

export function PanelHead({
  title,
  note,
  icon,
  actions,
}: {
  title: Bi
  note?: Bi
  icon?: string
  actions?: ReactNode
}) {
  const { t } = useI18n()
  return (
    <header className="mb-4 flex flex-wrap items-start justify-between gap-2 border-b border-hairline pb-3">
      <div className="flex min-w-0 items-start gap-2.5">
        {icon && (
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded bg-primary/8 text-primary">
            <Icon name={icon} className="text-[1.0625rem]" />
          </span>
        )}
        <div className="min-w-0">
          <h2 className="font-headline-sm text-[1.0625rem] leading-6 font-bold tracking-tight text-on-surface">
            {t(title)}
          </h2>
          {note && (
            <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">{t(note)}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-1.5">{actions}</div>}
    </header>
  )
}

/* ------------------------------------------------------------------ *
 * Status — reserved colours, always shipped with an icon + label so
 * meaning never rests on hue alone.
 * ------------------------------------------------------------------ */

export type Tone = 'good' | 'warning' | 'serious' | 'critical' | 'neutral' | 'info'

const TONE_CHIP: Record<Tone, string> = {
  good: 'bg-good/12 text-good-ink',
  warning: 'bg-warning/20 text-[#6b4a00]',
  serious: 'bg-serious/20 text-[#8a3b16]',
  critical: 'bg-crit/12 text-crit',
  neutral: 'bg-surface-container-high text-on-surface-variant',
  info: 'bg-viz-1/12 text-[#1c5cab]',
}

const TONE_ICON: Record<Tone, string> = {
  good: 'check_circle',
  warning: 'warning',
  serious: 'error',
  critical: 'dangerous',
  neutral: 'radio_button_unchecked',
  info: 'info',
}

export const TONE_DOT: Record<Tone, string> = {
  good: 'bg-good',
  warning: 'bg-warning',
  serious: 'bg-serious',
  critical: 'bg-crit',
  neutral: 'bg-outline',
  info: 'bg-viz-1',
}

export function Status({
  tone,
  label,
  compact = false,
}: {
  tone: Tone
  label: Bi | string
  compact?: boolean
}) {
  const { t } = useI18n()
  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-label-sm text-label-sm font-bold whitespace-nowrap ${TONE_CHIP[tone]}`}
    >
      {!compact && <Icon name={TONE_ICON[tone]} className="text-[0.875rem]" />}
      {t(label)}
    </span>
  )
}

export function Tag({ label, className = '' }: { label: Bi | string; className?: string }) {
  const { t } = useI18n()
  return (
    <span
      className={`inline-flex items-center rounded bg-surface-container px-1.5 py-0.5 font-label-sm text-label-sm font-semibold whitespace-nowrap text-on-surface-variant ${className}`}
    >
      {t(label)}
    </span>
  )
}

/* ------------------------------------------------------------------ *
 * Stat tile — a headline number needs no plot; a sparkline is optional.
 * ------------------------------------------------------------------ */

export function Stat({
  label,
  value,
  unit,
  delta,
  deltaTone = 'neutral',
  meter,
  meterTone = 'primary',
  footnote,
  onClick,
}: {
  label: Bi
  value: string
  unit?: string
  delta?: string
  deltaTone?: 'good' | 'bad' | 'neutral'
  meter?: number
  meterTone?: 'primary' | 'good' | 'warning' | 'critical' | 'viz-1'
  footnote?: Bi | string
  onClick?: () => void
}) {
  const { t } = useI18n()
  const deltaClass =
    deltaTone === 'good'
      ? 'text-good-ink'
      : deltaTone === 'bad'
        ? 'text-crit'
        : 'text-on-surface-variant'
  const meterClass = {
    primary: 'bg-primary',
    good: 'bg-good',
    warning: 'bg-warning',
    critical: 'bg-crit',
    'viz-1': 'bg-viz-1',
  }[meterTone]

  const Tag_ = onClick ? 'button' : 'div'

  return (
    <Tag_
      {...(onClick ? { type: 'button' as const, onClick } : {})}
      data-print="page"
      className={`card relative flex min-w-0 flex-col justify-between gap-2 overflow-hidden p-3.5 text-left sm:p-4 ${
        onClick ? 'card-lift cursor-pointer' : ''
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-[3px] ${meterClass} opacity-75`}
      />
      <span className="font-label-sm text-label-sm font-semibold tracking-wide text-on-surface-variant uppercase">
        {t(label)}
      </span>
      <span className="flex flex-wrap items-baseline gap-1.5">
        <span className="font-telemetry-metric text-[1.625rem] leading-8 font-bold tracking-tight text-on-surface sm:text-[1.875rem] sm:leading-9">
          {value}
        </span>
        {unit && (
          <span className="font-label-sm text-label-sm text-on-surface-variant">{unit}</span>
        )}
        {delta && (
          <span className={`font-label-sm text-label-sm font-bold ${deltaClass}`}>{delta}</span>
        )}
      </span>
      {footnote && (
        <span className="font-body-sm text-body-sm text-on-surface-variant">{t(footnote)}</span>
      )}
      {meter !== undefined && (
        <span className="block h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
          <span
            className={`block h-full rounded-full ${meterClass}`}
            style={{ width: `${Math.max(0, Math.min(100, meter))}%` }}
          />
        </span>
      )}
    </Tag_>
  )
}

export function StatGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-5">{children}</div>
  )
}

/* ------------------------------------------------------------------ *
 * Buttons
 * ------------------------------------------------------------------ */

type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent'

const BTN: Record<BtnVariant, string> = {
  primary: 'bg-primary text-on-primary hover:bg-primary-container shadow-sm',
  secondary:
    'bg-surface-container-low text-on-surface border border-hairline hover:bg-surface-container hover:border-hairline-strong',
  ghost: 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
  danger: 'bg-error text-on-error hover:opacity-90 shadow-sm',
  accent: 'bg-secondary text-on-secondary hover:opacity-95 shadow-sm',
}

export function Btn({
  label,
  icon,
  variant = 'secondary',
  onClick,
  full = false,
  title,
}: {
  label?: Bi | string
  icon?: string
  variant?: BtnVariant
  onClick?: () => void
  full?: boolean
  title?: string
}) {
  const { t } = useI18n()
  return (
    <button
      type="button"
      onClick={onClick}
      title={title ?? (label ? t(label) : undefined)}
      aria-label={!label && title ? title : undefined}
      className={`inline-flex items-center justify-center gap-1.5 rounded px-2.5 py-1.5 font-label-sm text-label-sm font-semibold transition-colors ${BTN[variant]} ${
        full ? 'w-full' : ''
      }`}
    >
      {icon && <Icon name={icon} className="text-base" />}
      {label && <span>{t(label)}</span>}
    </button>
  )
}

/* ------------------------------------------------------------------ *
 * Segmented control — filters live in one row above the content.
 * ------------------------------------------------------------------ */

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: Bi | string }[]
  value: T
  onChange: (value: T) => void
}) {
  const { t } = useI18n()
  return (
    <div
      className="flex items-center gap-0.5 rounded border border-hairline bg-surface-container-low p-0.5"
      role="tablist"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={option.value === value}
          onClick={() => onChange(option.value)}
          className={`rounded px-2 py-1 font-label-sm text-label-sm font-semibold whitespace-nowrap transition-colors ${
            option.value === value
              ? 'bg-primary text-on-primary shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
          }`}
        >
          {t(option.label)}
        </button>
      ))}
    </div>
  )
}
