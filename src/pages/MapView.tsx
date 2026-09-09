import { useMemo, useState } from 'react'
import { bi, num, useI18n, type Bi } from '../i18n'
import { ui } from '../i18n/ui'
import { Icon } from '../components/Icon'
import { PageHead } from '../components/ui/PageHead'
import { Panel, PanelHead, Segmented, Status } from '../components/ui/Primitives'
import { SEQ } from '../components/ui/Charts'
import { DataTable, type Column } from '../components/ui/DataTable'
import { DrillDrawer, type Drill } from '../components/ui/Drawer'
import { BLOCKS, DESIG, SRC, TALUK_DESKS, TALUK_IDS, TALUK_LIST } from '../data/common'
import { DistrictMap } from '../components/ui/DistrictMap'

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

/** District totals the map has to reconcile with, taken from the source pages. */
const METRIC_TOTAL: Record<Metric, number> = {
  grievances: 557, // Grievances — pending across all five channels
  patta: 3038, // Revenue — patta transfers pending
  water: 168, // Infrastructure — habitations below 55 lpcd
  dbt: 3606, // Schemes — DBT exception records
}

/**
 * Size weight per unit, in the order each level lists them. Taluk weights are
 * the taluk shares from the revenue register and block weights the school
 * enrolment shares, so the biggest unit is the same one on every screen.
 * Panchayat and ward weights are the populations themselves.
 */
const UNIT_WEIGHT: Record<Level, number[]> = {
  taluk: [604, 812, 388, 296, 274, 233, 431],
  block: [28400, 34200, 19600, 12400, 14800, 16200, 11200, 18600, 15400, 13800],
  panchayat: [7400, 5200, 6100, 4300, 3600, 4900, 5800, 6600, 3200, 4100, 5400, 3800],
  ward: [11200, 13800, 9400, 12600, 8300, 11800, 7600, 13100, 9100, 10400, 7900, 11900],
}

/** Taluks and blocks cover the district; the panchayat and ward lists are a sample. */
const COVERAGE: Record<Level, number> = { taluk: 1, block: 1, panchayat: 0.08, ward: 0.1 }

/** Krishnagiri district, 2011 census. */
const DISTRICT_POPULATION = 1879809

/** Split a total across weights so the parts always add back to the whole. */
function distribute(total: number, weights: number[]) {
  const sum = weights.reduce((acc, weight) => acc + weight, 0)
  const exact = weights.map((weight) => (total * weight) / sum)
  const out = exact.map((value) => Math.floor(value))
  const remainder = total - out.reduce((acc, value) => acc + value, 0)
  const byFraction = exact
    .map((value, index) => ({ index, frac: value - Math.floor(value) }))
    .sort((a, b) => b.frac - a.frac)
  for (let i = 0; i < remainder; i += 1) out[byFraction[i % byFraction.length].index] += 1
  return out
}

/** Population is a property of the place, so it does not move with the metric. */
function populationFor(level: Level, index: number) {
  const weights = UNIT_WEIGHT[level]
  if (level === 'panchayat' || level === 'ward') return weights[index]
  const sum = weights.reduce((acc, weight) => acc + weight, 0)
  return Math.round((DISTRICT_POPULATION * weights[index]) / sum / 100) * 100
}

/** Rows for one level: the metric total split by weight, plus the desk holding it. */
function buildRows(level: Level, metric: Metric) {
  const total = Math.round(METRIC_TOTAL[metric] * COVERAGE[level])
  const values = distribute(total, UNIT_WEIGHT[level])
  return UNITS[level].map((unit, index) => {
    // Taluks carry their actual Tahsildar; finer levels roll up to the same desk.
    const desk = TALUK_DESKS[TALUK_IDS[index % TALUK_IDS.length]]
    return {
      id: `${level}-${index}`,
      unit,
      value: values[index],
      population: populationFor(level, index),
      oldestDays: 24 + ((index * 17) % 68),
      lastVisit: `${1 + ((index * 5) % 22)} Oct 2024`,
      officer: desk.name,
      designation: level === 'taluk' ? DESIG.tahsildar : DESIG.vao,
      phone: desk.phone,
    }
  })
}

export function MapViewPage() {
  const { t } = useI18n()
  const [level, setLevel] = useState<Level>('taluk')
  const [metric, setMetric] = useState<Metric>('grievances')
  const [drill, setDrill] = useState<Drill | null>(null)

  const rows = useMemo(() => buildRows(level, metric), [level, metric])

  /** The map always reads at taluk level, whatever the grid below is showing. */
  const talukRows = useMemo(() => buildRows('taluk', metric), [metric])
  const mapUnits = talukRows.map((row, index) => ({
    id: TALUK_IDS[index],
    label: row.unit,
    value: row.value,
  }))
  const busiest = talukRows.reduce((top, row) => (row.value > top.value ? row : top), talukRows[0])

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
        { label: bi('Oldest item', 'மிகப் பழையது'), value: `${num(row.oldestDays)} ${t(ui.days)}` },
        { label: bi('Population', 'மக்கள் தொகை'), value: num(row.population) },
        { label: bi('Last field visit', 'கடைசி கள வருகை'), value: row.lastVisit },
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

      <Panel>
        <PanelHead
          icon="map"
          title={bi('Krishnagiri district — by taluk', 'கிருஷ்ணகிரி மாவட்டம் — வட்டவாரி')}
          note={bi('Tap a taluk for the officer holding it', 'வட்டத்தைத் தொட்டால் பொறுப்பு அலுவலர்')}
        />

        {/* One sentence saying what is on screen, before any colour is read. */}
        <p className="mb-3 font-body-sm text-body-sm text-on-surface-variant">
          {t(metricMeta.label)}: {num(METRIC_TOTAL[metric])} {t(metricMeta.unit)}{' '}
          {t(bi('across the district. Highest —', 'மாவட்டம் முழுவதும். அதிகபட்சம் —'))}{' '}
          <span className="font-bold text-on-surface">
            {t(busiest.unit)} ({num(busiest.value)})
          </span>
          .
        </p>

        <DistrictMap
          units={mapUnits}
          unit={metricMeta.unit}
          highlight={['krishnagiri', 'hosur']}
          onSelect={(id) => {
            const index = TALUK_IDS.indexOf(id as (typeof TALUK_IDS)[number])
            if (index >= 0) openDrill(talukRows[index])
          }}
        />

        <p className="mt-3 font-label-sm text-label-sm text-on-surface-variant">
          {t(bi('7 taluks · 10 blocks · 337 panchayats · NH-44 runs Hosur–Krishnagiri', '7 வட்டம் · 10 ஒன்றியம் · 337 ஊராட்சி · தே.நெ 44 ஓசூர்–கிருஷ்ணகிரி'))}
        </p>
      </Panel>

      <Panel>
        <PanelHead
          icon="grid_view"
          title={metricMeta.label}
          note={
            level === 'taluk' || level === 'block'
              ? bi(
                  'Darker means more pending · tiles add up to the district total',
                  'அடர் நிறம் = அதிக நிலுவை · அனைத்தும் சேர்ந்து மாவட்ட மொத்தம்',
                )
              : bi(
                  'Darker means more pending · sample of 12 units, not the full district',
                  'அடர் நிறம் = அதிக நிலுவை · 12 அலகுகள் மாதிரி, முழு மாவட்டம் அல்ல',
                )
          }
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
