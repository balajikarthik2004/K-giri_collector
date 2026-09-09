import { useMemo, useState } from 'react'
import { bi, num, useI18n, type Bi } from '../i18n'
import { ui } from '../i18n/ui'
import { Icon } from '../components/Icon'
import { PageHead } from '../components/ui/PageHead'
import { Panel, PanelHead, Segmented, Status } from '../components/ui/Primitives'
import { SEQ } from '../components/ui/Charts'
import { DataTable, type Column } from '../components/ui/DataTable'
import { DrillDrawer, type Drill } from '../components/ui/Drawer'
import { BLOCKS, DESIG, SRC, TALUK_LIST } from '../data/common'
import { MAP_SRC } from '../data/portal'

type Level = 'taluk' | 'block' | 'panchayat' | 'ward'
type Metric = 'grievances' | 'patta' | 'water' | 'dbt'

const METRICS: { value: Metric; label: Bi; unit: Bi }[] = [
  { value: 'grievances', label: bi('Pending grievances', 'நிலுவை மனுக்கள்'), unit: bi('petitions', 'மனுக்கள்') },
  { value: 'patta', label: bi('Patta pendency', 'பட்டா நிலுவை'), unit: bi('files', 'கோப்புகள்') },
  { value: 'water', label: bi('Water shortfall', 'குடிநீர் பற்றாக்குறை'), unit: bi('habitations', 'குடியிருப்புகள்') },
  { value: 'dbt', label: bi('DBT failures', 'நேரடி நிதி தோல்வி'), unit: bi('records', 'பதிவுகள்') },
]

const PANCHAYATS: Bi[] = [
  bi('Berigai', 'பேரிகை'), bi('Zuzuvadi', 'ஜுஜுவாடி'), bi('Moranapalli', 'மோரனப்பள்ளி'),
  bi('Samalpallam', 'சாமல்பள்ளம்'), bi('Achettipalli', 'அச்செட்டிபள்ளி'), bi('Kothapalli', 'கொத்தப்பள்ளி'),
  bi('Nallur', 'நல்லூர்'), bi('Belathur', 'பேளத்தூர்'), bi('Onnalvadi', 'ஒன்னால்வாடி'),
  bi('Madhagondapalli', 'மாதகொண்டபள்ளி'), bi('Rayakottai', 'ராயக்கோட்டை'), bi('Gundalapatti', 'குண்டலப்பட்டி'),
]

const WARDS: Bi[] = Array.from({ length: 12 }, (_, index) =>
  bi(`Hosur ward ${index + 1}`, `ஓசூர் வார்டு ${index + 1}`),
)

const UNITS: Record<Level, Bi[]> = {
  taluk: TALUK_LIST,
  block: BLOCKS,
  panchayat: PANCHAYATS,
  ward: WARDS,
}

/** Tahsildar desks, in the same order as TALUK_LIST, matching the revenue register. */
const TALUK_DESKS = [
  { name: 'K. Sekar', phone: '+914343232102' },
  { name: 'M. Anbarasi', phone: '+914344222101' },
  { name: 'R. Vinoth', phone: '+914347222104' },
  { name: 'S. Kavitha', phone: '+914343222105' },
  { name: 'G. Murugan', phone: '+914343222106' },
  { name: 'A. Jothi', phone: '+914343222107' },
  { name: 'P. Devi', phone: '+914344222103' },
]

/** Deterministic pseudo-values so the same unit always reads the same. */
function valueFor(level: Level, index: number, metric: Metric) {
  const base = { grievances: 412, patta: 812, water: 46, dbt: 2140 }[metric]
  const scale = { taluk: 1, block: 0.62, panchayat: 0.18, ward: 0.09 }[level]
  const wobble = ((index * 37) % 11) / 10 + 0.35
  return Math.round(base * scale * wobble)
}

export function MapViewPage() {
  const { t } = useI18n()
  const [level, setLevel] = useState<Level>('taluk')
  const [metric, setMetric] = useState<Metric>('grievances')
  const [drill, setDrill] = useState<Drill | null>(null)

  const rows = useMemo(
    () =>
      UNITS[level].map((unit, index) => {
        // Taluks carry their actual Tahsildar; finer levels roll up to the same desk.
        const desk = level === 'taluk' ? TALUK_DESKS[index] : TALUK_DESKS[index % TALUK_DESKS.length]
        return {
          id: `${level}-${index}`,
          unit,
          value: valueFor(level, index, metric),
          officer: desk.name,
          designation: level === 'taluk' ? DESIG.tahsildar : DESIG.vao,
          phone: desk.phone,
        }
      }),
    [level, metric],
  )

  const max = Math.max(...rows.map((row) => row.value), 1)
  const metricMeta = METRICS.find((item) => item.value === metric)!

  const columns: Column<(typeof rows)[number]>[] = [
    { key: 'unit', head: bi('Unit', 'அலகு'), text: (row) => t(row.unit) },
    {
      key: 'value',
      head: metricMeta.label,
      align: 'right',
      text: (row) => num(row.value),
      render: (row) => (
        <Status
          tone={row.value > max * 0.75 ? 'critical' : row.value > max * 0.45 ? 'serious' : 'good'}
          label={num(row.value)}
        />
      ),
    },
    { key: 'officer', head: bi('Responsible officer', 'பொறுப்பு அலுவலர்'), text: (row) => row.officer },
  ]

  const openDrill = (row: (typeof rows)[number]) =>
    setDrill({
      title: t(row.unit),
      ref: row.id.toUpperCase(),
      tone: row.value > max * 0.75 ? 'critical' : 'warning',
      status: `${num(row.value)} ${t(metricMeta.unit)}`,
      facts: [
        { label: bi('Level', 'நிலை'), value: t(ui[level]) },
        { label: metricMeta.label, value: num(row.value) },
        { label: bi('Open beyond SLA', 'கால வரம்பு மீறல்'), value: num(Math.round(row.value * 0.18)) },
        { label: bi('Oldest item', 'மிகப் பழையது'), value: '68 days' },
        { label: bi('Population', 'மக்கள் தொகை'), value: num(18400 + row.value * 7) },
        { label: bi('Last field visit', 'கடைசி கள வருகை'), value: '12 Oct 2024' },
      ],
      officer: { name: row.officer, designation: row.designation, phone: row.phone },
      audit: { updated: '24 Oct 08:30', by: 'District GIS aggregation', source: SRC.eservices },
      actions: [{ label: bi('Schedule visit', 'கள வருகை திட்டம்'), icon: 'event', variant: 'accent' }],
    })

  return (
    <div className="flex flex-col gap-4">
      <PageHead
        title={bi('Map & drill-down', 'வரைபடம் & விவரம்')}
        note={bi('Any metric, any level, down to the officer responsible', 'எந்த அளவீடும், எந்த நிலையிலும், பொறுப்பு அலுவலர் வரை')}
        icon="map"
        filters={
          <Segmented
            value={metric}
            onChange={setMetric}
            options={METRICS.map((item) => ({ value: item.value, label: item.label }))}
          />
        }
      />

      <Panel pad={false} className="overflow-hidden">
        <div
          className="relative flex h-48 items-end bg-cover bg-center p-4 sm:h-56"
          style={{ backgroundImage: `url('${MAP_SRC}')` }}
          role="img"
          aria-label={t(bi('Krishnagiri district command grid', 'கிருஷ்ணகிரி மாவட்ட கட்டளை வரைபடம்'))}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <div className="relative z-10 flex w-full flex-wrap items-end justify-between gap-3 text-white">
            <div>
              <p className="font-headline-sm text-headline-sm font-bold">
                {t(bi('Krishnagiri district command grid', 'கிருஷ்ணகிரி மாவட்ட கட்டளை வரைபடம்'))}
              </p>
              <p className="font-body-sm text-body-sm opacity-85">
                {t(bi('NH-44 corridor · 7 taluks · 10 blocks · 337 panchayats', 'தே.நெ 44 வழித்தடம் · 7 வட்டம் · 10 ஒன்றியம் · 337 ஊராட்சி'))}
              </p>
            </div>
            <span className="rounded bg-white/90 px-2.5 py-1 font-label-sm text-label-sm font-bold text-primary">
              {t(bi('7/7 Tahsildars logged in', '7/7 வட்டாட்சியர் இணைப்பில்'))}
            </span>
          </div>
        </div>
      </Panel>

      <Panel>
        <PanelHead
          icon="grid_view"
          title={metricMeta.label}
          note={bi('Darker means more pending — tap a tile to drill down', 'அடர் நிறம் = அதிக நிலுவை — விவரத்திற்கு தட்டவும்')}
          actions={
            <Segmented
              value={level}
              onChange={setLevel}
              options={[
                { value: 'taluk', label: ui.taluk },
                { value: 'block', label: ui.block },
                { value: 'panchayat', label: ui.panchayat },
                { value: 'ward', label: ui.ward },
              ]}
            />
          }
        />

        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {rows.map((row) => {
            const intensity = Math.min(SEQ.length - 1, Math.floor((row.value / max) * SEQ.length))
            return (
              <li key={row.id}>
                <button
                  type="button"
                  onClick={() => openDrill(row)}
                  className="flex w-full flex-col gap-1 rounded-lg p-3 text-left transition-transform hover:scale-[1.02]"
                  style={{
                    background: SEQ[intensity],
                    color: intensity >= 3 ? '#ffffff' : 'var(--color-on-surface)',
                  }}
                >
                  <span className="truncate font-label-md text-label-md font-bold">
                    {t(row.unit)}
                  </span>
                  <span className="font-telemetry-metric text-[1.375rem] leading-7 font-bold tabular-nums">
                    {num(row.value)}
                  </span>
                  <span className="truncate font-label-sm text-label-sm opacity-85">
                    {row.officer}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="mt-3 flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
          {t(bi('Low', 'குறைவு'))}
          <span className="flex items-center gap-[2px]">
            {SEQ.map((step) => (
              <span key={step} className="h-2.5 w-6 rounded-[2px]" style={{ background: step }} />
            ))}
          </span>
          {t(bi('High', 'அதிகம்'))}
        </div>
      </Panel>

      <Panel>
        <PanelHead
          icon="list"
          title={bi('Same data as a list', 'அதே தரவு பட்டியலாக')}
          note={bi('Sortable, searchable, exportable', 'வரிசைப்படுத்தக்கூடிய, தேடக்கூடிய, ஏற்றுமதி செய்யக்கூடிய')}
          actions={
            <span className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
              <Icon name="touch_app" className="text-sm" />
              {t(ui.drillDown)}
            </span>
          }
        />
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(row) => row.id}
          dense
          exportName={`krishnagiri-${level}-${metric}`}
          onRowClick={openDrill}
        />
      </Panel>

      <DrillDrawer drill={drill} onClose={() => setDrill(null)} />
    </div>
  )
}
