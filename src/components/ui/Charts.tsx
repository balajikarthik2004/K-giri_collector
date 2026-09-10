import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { useI18n, num, type Bi } from '../../i18n'

/* Series colours: fixed order, never cycled. Identity only. */
export const SERIES = ['var(--color-viz-1)', 'var(--color-viz-2)', 'var(--color-viz-3)', 'var(--color-viz-4)']
export const SEQ = [
  'var(--color-seq-100)',
  'var(--color-seq-200)',
  'var(--color-seq-300)',
  'var(--color-seq-400)',
  'var(--color-seq-500)',
  'var(--color-seq-600)',
  'var(--color-seq-700)',
]

const GRID = 'var(--color-grid)'
const AXIS = 'var(--color-axis)'
const MUTED = 'var(--color-muted-ink)'
const SURFACE = 'var(--color-surface-container-lowest)'

/** Measures the container so marks never distort under preserveAspectRatio. */
function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(node)
    setWidth(node.clientWidth)
    return () => observer.disconnect()
  }, [])
  return [ref, width] as const
}

/** Rounded data-end anchored to the baseline (4px), per mark spec. */
function columnPath(x: number, y: number, w: number, h: number, r = 4) {
  const radius = Math.min(r, w / 2, Math.max(h, 0))
  if (h <= 0.5) return ''
  return `M${x} ${y + h} V${y + radius} Q${x} ${y} ${x + radius} ${y} H${x + w - radius} Q${x + w} ${y} ${x + w} ${y + radius} V${y + h} Z`
}

function rowPath(x: number, y: number, w: number, h: number, r = 4) {
  const radius = Math.min(r, h / 2, Math.max(w, 0))
  if (w <= 0.5) return ''
  return `M${x} ${y} H${x + w - radius} Q${x + w} ${y} ${x + w} ${y + radius} V${y + h - radius} Q${x + w} ${y + h} ${x + w - radius} ${y + h} H${x} Z`
}

/* ------------------------------------------------------------------ *
 * Tooltip shell shared by every hoverable chart.
 * ------------------------------------------------------------------ */

function Tip({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return (
    <div
      className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded bg-inverse-surface px-2 py-1 font-label-sm text-label-sm whitespace-nowrap text-inverse-on-surface shadow-md"
      style={{ left: x, top: y - 8 }}
    >
      {children}
    </div>
  )
}

export function Legend({ items }: { items: { label: Bi | string; color: string }[] }) {
  const { t } = useI18n()
  return (
    <ul className="flex flex-wrap items-center gap-x-3 gap-y-1">
      {items.map((item) => (
        <li
          key={t(item.label)}
          className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant"
        >
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
            style={{ background: item.color }}
          />
          {t(item.label)}
        </li>
      ))}
    </ul>
  )
}

/* ------------------------------------------------------------------ *
 * Column chart — change over time. One or two series, one axis.
 * ------------------------------------------------------------------ */

export type ColumnDatum = { label: Bi | string; a: number; b?: number }

export function ColumnChart({
  data,
  height = 150,
  seriesA,
  seriesB,
  unit = '',
}: {
  data: ColumnDatum[]
  height?: number
  seriesA: Bi | string
  seriesB?: Bi | string
  unit?: string
}) {
  const { t } = useI18n()
  const [ref, width] = useWidth<HTMLDivElement>()
  const [hover, setHover] = useState<number | null>(null)

  const padB = 18
  const padT = 8
  const plot = height - padB - padT
  const max = Math.max(...data.flatMap((d) => [d.a, d.b ?? 0]), 1)
  const step = width / Math.max(data.length, 1)
  const grouped = seriesB !== undefined
  const barW = Math.max(4, Math.min(grouped ? (step - 10) / 2 - 1 : step - 10, 26))

  const ticks = [0, 0.5, 1]

  return (
    <div ref={ref} className="relative w-full">
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label={t(seriesA)}>
          {ticks.map((tick) => (
            <line
              key={tick}
              x1={0}
              x2={width}
              y1={padT + plot - plot * tick}
              y2={padT + plot - plot * tick}
              stroke={tick === 0 ? AXIS : GRID}
              strokeWidth={1}
            />
          ))}

          {data.map((datum, index) => {
            const cx = step * index + step / 2
            const aH = (datum.a / max) * plot
            const bH = ((datum.b ?? 0) / max) * plot
            const aX = grouped ? cx - barW - 1 : cx - barW / 2
            const bX = cx + 1
            return (
              <g
                key={index}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(null)}
              >
                <rect x={step * index} y={0} width={step} height={height} fill="transparent" />
                <path d={columnPath(aX, padT + plot - aH, barW, aH)} fill={SERIES[0]} />
                {grouped && (
                  <path d={columnPath(bX, padT + plot - bH, barW, bH)} fill={SERIES[1]} />
                )}
                <text
                  x={cx}
                  y={height - 5}
                  textAnchor="middle"
                  fontSize={10}
                  fill={hover === index ? 'var(--color-on-surface)' : MUTED}
                  fontWeight={hover === index ? 700 : 500}
                >
                  {t(datum.label)}
                </text>
              </g>
            )
          })}
        </svg>
      )}

      {hover !== null && (
        <Tip x={step * hover + step / 2} y={padT + plot - (data[hover].a / max) * plot}>
          <span className="font-bold">{t(data[hover].label)}</span>
          {' · '}
          {num(data[hover].a)}
          {unit}
          {grouped && ` / ${num(data[hover].b ?? 0)}${unit}`}
        </Tip>
      )}

      <div className="mt-2">
        <Legend
          items={
            grouped
              ? [
                  { label: seriesA, color: SERIES[0] },
                  { label: seriesB, color: SERIES[1] },
                ]
              : [{ label: seriesA, color: SERIES[0] }]
          }
        />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Bar list — ranked magnitude with direct labels (satisfies the
 * relief rule: every value is visible as text).
 * ------------------------------------------------------------------ */

export type BarDatum = {
  label: Bi | string
  value: number
  note?: string
  color?: string
  onClick?: () => void
}

export function BarList({
  data,
  unit = '',
  max: maxOverride,
}: {
  data: BarDatum[]
  unit?: string
  max?: number
}) {
  const { t } = useI18n()
  const [ref, width] = useWidth<HTMLUListElement>()
  const max = maxOverride ?? Math.max(...data.map((d) => d.value), 1)

  return (
    <ul ref={ref} className="flex flex-col gap-2">
      {data.map((datum) => {
        const Row = datum.onClick ? 'button' : 'div'
        return (
          <li key={t(datum.label)}>
            <Row
              {...(datum.onClick ? { type: 'button' as const, onClick: datum.onClick } : {})}
              className={`w-full text-left ${datum.onClick ? 'group cursor-pointer' : ''}`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate font-label-sm text-label-sm font-semibold text-on-surface group-hover:text-primary">
                  {t(datum.label)}
                </span>
                <span className="shrink-0 font-label-sm text-label-sm font-bold tabular-nums text-on-surface">
                  {num(datum.value)}
                  {unit}
                  {datum.note && (
                    <span className="ml-1 font-normal text-on-surface-variant">{datum.note}</span>
                  )}
                </span>
              </div>
              <svg width={width || 1} height={8} className="mt-1 block">
                <rect x={0} y={1} width={width || 1} height={6} rx={3} fill="var(--color-surface-container)" />
                <path
                  d={rowPath(0, 1, Math.max((datum.value / max) * width, 0), 6, 3)}
                  fill={datum.color ?? SERIES[0]}
                />
              </svg>
            </Row>
          </li>
        )
      })}
    </ul>
  )
}

/* ------------------------------------------------------------------ *
 * Donut — composition. Max three slices plus "Other" (all-pairs cap).
 * ------------------------------------------------------------------ */

export function Donut({
  data,
  centerValue,
  centerLabel,
  size = 132,
}: {
  data: { label: Bi | string; value: number; color?: string }[]
  centerValue: string
  centerLabel: Bi | string
  size?: number
}) {
  const { t } = useI18n()
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1
  const r = size / 2 - 10
  const c = size / 2
  const circumference = 2 * Math.PI * r
  // Precompute each arc's start so nothing is mutated while rendering.
  const offsets = data.reduce<number[]>((acc, _, index) => {
    acc.push(index === 0 ? 0 : acc[index - 1] + (data[index - 1].value / total) * circumference)
    return acc
  }, [])

  return (
    <div className="flex flex-wrap items-center gap-4">
      <svg width={size} height={size} className="shrink-0" role="img" aria-label={t(centerLabel)}>
        <circle cx={c} cy={c} r={r} fill="none" stroke="var(--color-surface-container)" strokeWidth={14} />
        {data.map((datum, index) => {
          const dash = Math.max((datum.value / total) * circumference - 2, 0) /* 2px surface gap */
          return (
            <circle
              key={t(datum.label)}
              cx={c}
              cy={c}
              r={r}
              fill="none"
              stroke={datum.color ?? SERIES[index]}
              strokeWidth={14}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offsets[index]}
              transform={`rotate(-90 ${c} ${c})`}
            />
          )
        })}
        <text
          x={c}
          y={c - 2}
          textAnchor="middle"
          fontSize={20}
          fontWeight={700}
          fill="var(--color-on-surface)"
        >
          {centerValue}
        </text>
        <text x={c} y={c + 14} textAnchor="middle" fontSize={9} fill={MUTED}>
          {t(centerLabel)}
        </text>
      </svg>

      <ul className="flex min-w-[9rem] flex-1 flex-col gap-1.5">
        {data.map((datum, index) => (
          <li key={t(datum.label)} className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                style={{ background: datum.color ?? SERIES[index] }}
              />
              <span className="truncate">{t(datum.label)}</span>
            </span>
            <span className="shrink-0 font-label-sm text-label-sm font-bold tabular-nums text-on-surface">
              {num(datum.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Sparkline — trend beside a number. 2px line, marker on the last point.
 * ------------------------------------------------------------------ */

export function Sparkline({
  values,
  height = 32,
  tone = SERIES[0],
}: {
  values: number[]
  height?: number
  tone?: string
}) {
  const [ref, width] = useWidth<HTMLDivElement>()
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const stepX = width / Math.max(values.length - 1, 1)
  const y = (value: number) => height - 4 - ((value - min) / span) * (height - 10)
  const points = values.map((value, index) => `${index * stepX},${y(value)}`).join(' ')

  return (
    <div ref={ref} className="w-full">
      {width > 0 && (
        <svg width={width} height={height} aria-hidden="true">
          <polyline points={points} fill="none" stroke={tone} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <circle
            cx={(values.length - 1) * stepX}
            cy={y(values[values.length - 1])}
            r={4}
            fill={tone}
            stroke={SURFACE}
            strokeWidth={2}
          />
        </svg>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Heatmap — sequential single hue. Cells carry their number, so the
 * reading never depends on colour alone.
 * ------------------------------------------------------------------ */

export function Heatmap({
  rows,
  columns,
  legend,
}: {
  rows: { label: Bi | string; values: number[] }[]
  columns: (Bi | string)[]
  legend?: Bi | string
}) {
  const { t } = useI18n()
  const columnMax = columns.map((_, column) =>
    Math.max(...rows.map((row) => row.values[column] ?? 0), 1),
  )
  const stepFor = (value: number, column: number) => {
    if (value === 0) return { bg: 'var(--color-surface-container)', ink: MUTED }
    const index = Math.min(SEQ.length - 1, Math.floor((value / columnMax[column]) * SEQ.length))
    return { bg: SEQ[index], ink: index >= 3 ? '#ffffff' : 'var(--color-on-surface)' }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[26rem] table-fixed border-separate border-spacing-[2px]">
        <thead>
          <tr>
            <th className="w-32 text-left font-label-sm text-label-sm font-semibold text-on-surface-variant" />
            {columns.map((column) => (
              <th
                key={t(column)}
                style={{ width: `${76 / columns.length}%` }}
                className="px-1 pb-1 text-center font-label-sm text-label-sm font-semibold whitespace-nowrap text-on-surface-variant"
              >
                {t(column)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={t(row.label)}>
              <th className="pr-2 text-left font-label-sm text-label-sm font-semibold whitespace-nowrap text-on-surface">
                {t(row.label)}
              </th>
              {row.values.map((value, index) => {
                const style = stepFor(value, index)
                return (
                  <td
                    key={index}
                    className="rounded px-2 py-1.5 text-center font-label-sm text-label-sm font-bold tabular-nums"
                    style={{ background: style.bg, color: style.ink }}
                  >
                    {num(value)}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {legend && (
        <p className="mt-2 flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
          {t(legend)}
          <span className="flex items-center gap-[2px]">
            {SEQ.map((step) => (
              <span key={step} className="h-2.5 w-4 rounded-[2px]" style={{ background: step }} />
            ))}
          </span>
        </p>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Line chart — a real time series: a labelled y axis, a hover
 * crosshair that reads every series at once, an optional confidence
 * band, and a dashed tail for the stretch of the line that is a
 * projection rather than a recorded figure.
 * ------------------------------------------------------------------ */

export type LineSeries = {
  label: Bi | string
  values: number[]
  color?: string
  /** Index from which the line is a projection: dashed, hollow markers. */
  forecastFrom?: number
}

/** Axis ticks a reader can do arithmetic on — 1 / 2 / 2.5 / 5 × a power of ten. */
function niceScale(lo: number, hi: number, count: number) {
  const raw = (hi - lo || 1) / count
  const magnitude = 10 ** Math.floor(Math.log10(raw))
  const step =
    [1, 2, 2.5, 5, 10].map((multiple) => multiple * magnitude).find((value) => value >= raw) ??
    magnitude * 10
  const start = Math.floor(lo / step) * step
  const end = Math.ceil(hi / step) * step
  const ticks: number[] = []
  for (let value = start; value <= end + step / 2; value += step) {
    ticks.push(Number(value.toFixed(6)))
  }
  return { ticks, lo: start, hi: end }
}

export function LineChart({
  labels,
  series,
  height = 200,
  unit = '',
  band,
  area = true,
  zeroFloor = true,
  tickCount = 4,
}: {
  labels: (Bi | string)[]
  series: LineSeries[]
  height?: number
  unit?: string
  /** Confidence interval drawn behind the lines, aligned to `labels`. */
  band?: { upper: number[]; lower: number[]; color?: string; label?: Bi | string }
  area?: boolean
  zeroFloor?: boolean
  tickCount?: number
}) {
  const { t } = useI18n()
  const [ref, width] = useWidth<HTMLDivElement>()
  const [hover, setHover] = useState<number | null>(null)
  const gradientId = useId()

  const padL = 40
  const padR = 10
  const padT = 10
  const padB = 22
  const plotW = Math.max(width - padL - padR, 1)
  const plotH = Math.max(height - padT - padB, 1)

  const pool = [
    ...series.flatMap((line) => line.values),
    ...(band ? [...band.upper, ...band.lower] : []),
  ].filter((value) => Number.isFinite(value))
  const scale = niceScale(
    zeroFloor ? Math.min(0, ...pool) : Math.min(...pool),
    Math.max(...pool, 1),
    tickCount,
  )

  const slotW = plotW / Math.max(labels.length - 1, 1)
  const x = (index: number) => padL + slotW * index
  const y = (value: number) =>
    padT + plotH - ((value - scale.lo) / (scale.hi - scale.lo || 1)) * plotH

  /** Every label if there is room, otherwise every other one. */
  const labelStep = slotW < 42 && labels.length > 9 ? 2 : 1

  const pointsFor = (values: number[], from: number, to: number) =>
    values
      .slice(from, to + 1)
      .map((value, index) => `${x(from + index)},${y(value)}`)
      .join(' ')

  return (
    <div ref={ref} className="relative w-full">
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label={t(series[0].label)}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={series[0].color ?? SERIES[0]} stopOpacity={0.22} />
              <stop offset="100%" stopColor={series[0].color ?? SERIES[0]} stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Gridlines with their value on the axis */}
          {scale.ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={padL}
                x2={width - padR}
                y1={y(tick)}
                y2={y(tick)}
                stroke={tick === 0 ? AXIS : GRID}
                strokeWidth={1}
              />
              <text x={padL - 6} y={y(tick) + 3} textAnchor="end" fontSize={9} fill={MUTED}>
                {num(tick, Number.isInteger(tick) ? 0 : 1)}
              </text>
            </g>
          ))}

          {/* Confidence band, behind the lines */}
          {band && (
            <path
              d={[
                `M${band.upper.map((value, index) => `${x(index)} ${y(value)}`).join(' L')}`,
                `L${band.lower
                  .map((value, index) => ({ value, index }))
                  .reverse()
                  .map((point) => `${x(point.index)} ${y(point.value)}`)
                  .join(' L')}`,
                'Z',
              ].join(' ')}
              fill={band.color ?? SERIES[0]}
              fillOpacity={0.13}
            />
          )}

          {/* Area under the primary series */}
          {area && (
            <path
              d={[
                `M${x(0)} ${y(series[0].values[0])}`,
                ...series[0].values.map((value, index) => `L${x(index)} ${y(value)}`),
                `L${x(series[0].values.length - 1)} ${padT + plotH}`,
                `L${x(0)} ${padT + plotH}`,
                'Z',
              ].join(' ')}
              fill={`url(#${gradientId})`}
            />
          )}

          {series.map((line, lineIndex) => {
            const color = line.color ?? SERIES[lineIndex]
            const split = line.forecastFrom ?? line.values.length - 1
            return (
              <g key={t(line.label)}>
                <polyline
                  points={pointsFor(line.values, 0, split)}
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {split < line.values.length - 1 && (
                  <polyline
                    points={pointsFor(line.values, split, line.values.length - 1)}
                    fill="none"
                    stroke={color}
                    strokeWidth={2}
                    strokeDasharray="5 4"
                    strokeLinecap="round"
                  />
                )}
                {line.values.map((value, index) => (
                  <circle
                    key={index}
                    cx={x(index)}
                    cy={y(value)}
                    r={hover === index ? 4 : 2.5}
                    fill={index > split ? SURFACE : color}
                    stroke={color}
                    strokeWidth={index > split ? 2 : 1}
                  />
                ))}
              </g>
            )
          })}

          {hover !== null && (
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1={padT}
              y2={padT + plotH}
              stroke={AXIS}
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          )}

          {/* Hit areas and the x axis */}
          {labels.map((label, index) => (
            <g key={index} onMouseEnter={() => setHover(index)} onMouseLeave={() => setHover(null)}>
              <rect
                x={x(index) - slotW / 2}
                y={padT}
                width={slotW}
                height={plotH}
                fill="transparent"
              />
              {index % labelStep === 0 && (
                <text
                  x={x(index)}
                  y={height - 6}
                  textAnchor={
                    index === 0 ? 'start' : index === labels.length - 1 ? 'end' : 'middle'
                  }
                  fontSize={10}
                  fill={hover === index ? 'var(--color-on-surface)' : MUTED}
                  fontWeight={hover === index ? 700 : 500}
                >
                  {t(label)}
                </text>
              )}
            </g>
          ))}
        </svg>
      )}

      {hover !== null && (
        <Tip x={x(hover)} y={Math.min(...series.map((line) => y(line.values[hover])))}>
          <span className="font-bold">{t(labels[hover])}</span>
          {series.map((line) => (
            <span key={t(line.label)}>
              {' · '}
              {t(line.label)}{' '}
              {num(line.values[hover], Number.isInteger(line.values[hover]) ? 0 : 1)}
              {unit}
            </span>
          ))}
        </Tip>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
        <Legend
          items={series.map((line, index) => ({
            label: line.label,
            color: line.color ?? SERIES[index],
          }))}
        />
        {band?.label && (
          <span className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
            <span
              className="h-2.5 w-4 shrink-0 rounded-[2px]"
              style={{ background: band.color ?? SERIES[0], opacity: 0.3 }}
            />
            {t(band.label)}
          </span>
        )}
      </div>
    </div>
  )
}
