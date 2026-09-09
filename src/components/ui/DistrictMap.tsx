import { bi, num, useI18n, type Bi } from '../../i18n'
import { SEQ } from './Charts'
import { DISTRICT_VIEW, TALUK_SHAPES, TOWNS } from '../../data/geo'

export type MapUnit = {
  /** Taluk key, matching TALUK_SHAPES. */
  id: string
  label: Bi
  value: number
}

/**
 * Choropleth of the seven taluks on their real boundaries.
 *
 * Shading uses equal-width buckets between the lowest and highest taluk, and
 * the legend prints the bucket edges, so a reader can turn a colour back into
 * a number instead of guessing from a "less → more" ramp.
 */
export function DistrictMap({
  units,
  unit,
  highlight = [],
  selectedId,
  onSelect,
}: {
  units: MapUnit[]
  /** What one value counts — "petitions", "files". */
  unit: Bi
  /** Taluks to outline in gold; the rest keep a hairline border. */
  highlight?: string[]
  selectedId?: string
  onSelect?: (id: string) => void
}) {
  const { t } = useI18n()
  const byId = new Map(units.map((item) => [item.id, item]))

  const values = units.map((item) => item.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = Math.max(max - min, 1)
  const step = span / SEQ.length

  const bucketOf = (value: number) =>
    Math.min(SEQ.length - 1, Math.floor(((value - min) / span) * SEQ.length))

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-center overflow-hidden rounded-lg border border-hairline bg-surface-container-lowest p-2">
        <svg
          viewBox={`0 0 ${DISTRICT_VIEW.width} ${DISTRICT_VIEW.height}`}
          preserveAspectRatio="xMidYMid meet"
          className="block h-auto w-full max-w-[48rem]"
          role="img"
          aria-label={t(bi('Krishnagiri district, shaded by taluk', 'கிருஷ்ணகிரி மாவட்டம், வட்டவாரி நிழல்'))}
        >
          <g>
            {TALUK_SHAPES.map((shape) => {
              const item = byId.get(shape.id)
              if (!item) return null
              const isHighlight = highlight.includes(shape.id)
              const isSelected = selectedId === shape.id
              return (
                <path
                  key={shape.id}
                  d={shape.d}
                  fill={SEQ[bucketOf(item.value)]}
                  stroke={
                    isSelected
                      ? 'var(--color-primary)'
                      : isHighlight
                        ? 'var(--color-secondary-fixed-dim)'
                        : 'rgba(255,255,255,0.85)'
                  }
                  strokeWidth={isSelected ? 5 : isHighlight ? 3.5 : 1.2}
                  strokeLinejoin="round"
                  className={onSelect ? 'cursor-pointer' : undefined}
                  onClick={onSelect ? () => onSelect(shape.id) : undefined}
                >
                  <title>{`${t(item.label)} — ${num(item.value)} ${t(unit)}`}</title>
                </path>
              )
            })}
          </g>

          {/* Name and value, drawn twice so they stay readable on any fill. */}
          <g pointerEvents="none">
            {TALUK_SHAPES.map((shape) => {
              const item = byId.get(shape.id)
              if (!item) return null
              const dark = bucketOf(item.value) >= 3
              const ink = dark ? '#ffffff' : 'var(--color-on-surface)'
              const halo = dark ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.9)'
              return (
                <g key={shape.id} transform={`translate(${shape.cx} ${shape.cy})`}>
                  {[true, false].map((isHalo) => (
                    <g
                      key={String(isHalo)}
                      fill={isHalo ? 'none' : ink}
                      stroke={isHalo ? halo : 'none'}
                      strokeWidth={isHalo ? 4 : 0}
                      strokeLinejoin="round"
                    >
                      <text textAnchor="middle" fontSize="21" fontWeight="700">
                        {t(item.label)}
                      </text>
                      <text y="25" textAnchor="middle" fontSize="25" fontWeight="800">
                        {num(item.value)}
                      </text>
                    </g>
                  ))}
                </g>
              )
            })}
          </g>

          {/* District HQ and the corporation, at their real coordinates. */}
          <g pointerEvents="none">
            {TOWNS.map((town) => (
              <g key={town.id} transform={`translate(${town.x} ${town.y})`}>
                <circle r="8" fill="var(--color-primary)" stroke="#ffffff" strokeWidth="3" />
                <circle r="2.5" fill="#ffffff" />
              </g>
            ))}
          </g>
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <span className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
          {num(min)}
          <span className="flex items-center gap-[2px]">
            {SEQ.map((shade, index) => (
              <span
                key={shade}
                className="h-2.5 w-5 rounded-[2px]"
                style={{ background: shade }}
                title={`${num(Math.round(min + index * step))}–${num(Math.round(min + (index + 1) * step))}`}
              />
            ))}
          </span>
          {num(max)} {t(unit)}
        </span>
        <span className="flex items-center gap-3 font-label-sm text-label-sm text-on-surface-variant">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-white" />
            {t(bi('Town', 'நகரம்'))}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-4 rounded-[2px] ring-2 ring-secondary-fixed-dim" />
            {t(bi('Krishnagiri & Hosur', 'கிருஷ்ணகிரி & ஓசூர்'))}
          </span>
        </span>
      </div>
    </div>
  )
}
