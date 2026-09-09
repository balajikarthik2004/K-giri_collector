import { useState } from 'react'
import { bi, num, pct, useI18n, type Bi } from '../i18n'
import { PageHead } from '../components/ui/PageHead'
import { Panel, PanelHead, Stat, StatGrid, Status } from '../components/ui/Primitives'
import { ColumnChart, Heatmap, Sparkline, SERIES } from '../components/ui/Charts'
import { DataTable, type Column } from '../components/ui/DataTable'
import { DrillDrawer, type Drill } from '../components/ui/Drawer'
import { BLOCKS, DESIG, MONTHS, SRC } from '../data/common'

const FEVER: { label: Bi; values: number[] }[] = BLOCKS.map((block, index) => ({
  label: block,
  values: [
    [186, 42, 9, 4],
    [312, 68, 14, 6],
    [124, 26, 5, 2],
    [88, 18, 3, 1],
    [142, 30, 6, 2],
    [96, 22, 4, 2],
    [118, 28, 5, 2],
    [102, 20, 3, 1],
    [74, 14, 2, 1],
    [58, 9, 1, 0],
  ][index],
}))

const FEVER_COLS: Bi[] = [
  bi('Fever screened', 'காய்ச்சல் பரிசோதனை'),
  bi('Dengue susp.', 'டெங்கு சந்தேகம்'),
  bi('Confirmed', 'உறுதி'),
  bi('Admitted', 'அனுமதி'),
]

type Facility = {
  id: string
  name: Bi
  type: Bi
  doctors: number
  sanctioned: number
  beds: number
  occupied: number
  tone: 'good' | 'warning' | 'serious' | 'critical'
}

const FACILITIES: Facility[] = [
  { id: 'gh-kri', name: bi('Krishnagiri Government Hospital', 'கிருஷ்ணகிரி அரசு மருத்துவமனை'), type: bi('District HQ', 'மாவட்ட தலைமை'), doctors: 62, sanctioned: 74, beds: 500, occupied: 398, tone: 'warning' },
  { id: 'gh-hsr', name: bi('Hosur Government Hospital', 'ஓசூர் அரசு மருத்துவமனை'), type: bi('Sub-district', 'உட்கோட்டம்'), doctors: 48, sanctioned: 52, beds: 350, occupied: 312, tone: 'serious' },
  { id: 'chc-sgr', name: bi('Shoolagiri CHC', 'சூளகிரி சமூக நல மையம்'), type: bi('CHC', 'சமூக நல மையம்'), doctors: 9, sanctioned: 12, beds: 60, occupied: 34, tone: 'warning' },
  { id: 'chc-den', name: bi('Denkanikottai CHC', 'தேன்கனிக்கோட்டை சமூக நல மையம்'), type: bi('CHC', 'சமூக நல மையம்'), doctors: 7, sanctioned: 12, beds: 50, occupied: 21, tone: 'critical' },
  { id: 'chc-uth', name: bi('Uthangarai CHC', 'ஊத்தங்கரை சமூக நல மையம்'), type: bi('CHC', 'சமூக நல மையம்'), doctors: 10, sanctioned: 12, beds: 60, occupied: 28, tone: 'good' },
]

const DELIVERIES = [
  { label: MONTHS[0], a: 1284, b: 1310 },
  { label: MONTHS[1], a: 1342, b: 1360 },
  { label: MONTHS[2], a: 1408, b: 1420 },
  { label: MONTHS[3], a: 1366, b: 1390 },
  { label: MONTHS[4], a: 1452, b: 1470 },
  { label: MONTHS[5], a: 1398, b: 1410 },
]

export function HealthPage() {
  const { t } = useI18n()
  const [drill, setDrill] = useState<Drill | null>(null)

  const columns: Column<Facility>[] = [
    {
      key: 'name',
      head: bi('Facility', 'நிறுவனம்'),
      text: (row) => t(row.name),
      render: (row) => (
        <span className="flex flex-col">
          <span className="font-label-md text-label-md font-bold">{t(row.name)}</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">{t(row.type)}</span>
        </span>
      ),
    },
    {
      key: 'doctors',
      head: bi('Doctors', 'மருத்துவர்கள்'),
      align: 'right',
      text: (row) => `${row.doctors} / ${row.sanctioned}`,
      render: (row) => (
        <Status
          tone={row.tone}
          label={`${row.doctors} / ${row.sanctioned}`}
        />
      ),
    },
    {
      key: 'beds',
      head: bi('Bed occupancy', 'படுக்கை பயன்பாடு'),
      align: 'right',
      text: (row) => `${row.occupied} / ${row.beds}`,
      render: (row) => (
        <span className="flex flex-col items-end gap-1">
          <span className="font-label-sm text-label-sm font-bold tabular-nums">
            {row.occupied} / {row.beds}
          </span>
          <span className="block h-1.5 w-20 overflow-hidden rounded-full bg-surface-container">
            <span
              className="block h-full rounded-full bg-viz-1"
              style={{ width: `${(row.occupied / row.beds) * 100}%` }}
            />
          </span>
        </span>
      ),
    },
    {
      key: 'free',
      head: bi('Free beds', 'காலி படுக்கை'),
      align: 'right',
      text: (row) => num(row.beds - row.occupied),
      minor: true,
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <PageHead
        title={bi('Public health', 'பொது சுகாதாரம்')}
        note={bi('Outbreaks, maternal care, staffing and beds', 'தொற்று, தாய்மை பராமரிப்பு, பணியாளர் மற்றும் படுக்கை')}
        icon="local_hospital"
      />

      <StatGrid>
        <Stat label={bi('Institutional deliveries', 'மருத்துவமனை பிரசவம்')} value="99.2%" delta="+0.4" deltaTone="good" meter={99.2} meterTone="good" />
        <Stat label={bi('IMR (per 1000)', 'குழந்தை இறப்பு விகிதம்')} value="8.4" delta="-1.2" deltaTone="good" />
        <Stat label={bi('MMR (per lakh)', 'தாய் இறப்பு விகிதம்')} value="41" delta="-6" deltaTone="good" />
        <Stat label={bi('Dengue confirmed (30 d)', 'டெங்கு உறுதி (30 நாள்)')} value="52" delta={t(bi('2 clusters', '2 கொத்து'))} deltaTone="bad" />
        <Stat label={bi('108 response time', '108 வருகை நேரம்')} value="11.2" unit={t(bi('min', 'நிமிடம்'))} delta={t(bi('108 fleet', '108 வாகனம்'))} deltaTone="good" />
      </StatGrid>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <PanelHead
            icon="coronavirus"
            title={bi('Fever surveillance by block', 'ஒன்றியவாரி காய்ச்சல் கண்காணிப்பு')}
            note={bi('Last 30 days', 'கடந்த 30 நாட்கள்')}
          />
          <Heatmap
            rows={FEVER}
            columns={FEVER_COLS}
            legend={bi('Fewer → more, shaded per column', 'குறைவு → அதிகம், நெடுவரிசை வாரியாக')}
          />
        </Panel>

        <Panel>
          <PanelHead
            icon="vaccines"
            title={bi('Programme coverage', 'திட்ட பரவல்')}
            note={bi('Against annual target', 'ஆண்டு இலக்கை ஒப்பிட')}
          />
          <ul className="flex flex-col gap-3">
            {[
              { label: bi('Child immunisation', 'குழந்தை தடுப்பூசி'), value: 97.4, tone: 'bg-good' },
              { label: bi('Makkalai Thedi Maruthuvam', 'மக்களைத் தேடி மருத்துவம்'), value: 88.6, tone: 'bg-viz-1' },
              { label: bi('NCD screening 30+', 'தொற்றா நோய் பரிசோதனை 30+'), value: 76.2, tone: 'bg-viz-2' },
              { label: bi('Antenatal registration', 'கர்ப்பகால பதிவு'), value: 94.1, tone: 'bg-viz-3' },
              { label: bi('PHC drug stock', 'ஆரம்ப சுகாதார மருந்து இருப்பு'), value: 91.0, tone: 'bg-good' },
            ].map((item) => (
              <li key={t(item.label)}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-label-sm text-label-sm font-semibold text-on-surface">
                    {t(item.label)}
                  </span>
                  <span className="font-label-sm text-label-sm font-bold tabular-nums text-on-surface">
                    {pct(item.value)}
                  </span>
                </div>
                <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-surface-container">
                  <span className={`block h-full rounded-full ${item.tone}`} style={{ width: `${item.value}%` }} />
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <p className="mb-1 font-label-sm text-label-sm text-on-surface-variant">
              {t(bi('Fever cases — 6 week trend', 'காய்ச்சல் — 6 வார போக்கு'))}
            </p>
            <Sparkline values={[142, 168, 196, 214, 188, 156]} height={36} tone={SERIES[1]} />
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel>
          <PanelHead
            icon="local_hospital"
            title={bi('Facilities, staffing and beds', 'நிறுவனம், பணியாளர் மற்றும் படுக்கை')}
            note={bi('Live bed availability', 'நேரலை படுக்கை இருப்பு')}
          />
          <DataTable
            columns={columns}
            rows={FACILITIES}
            rowKey={(row) => row.id}
            exportName="krishnagiri-health-facilities"
            onRowClick={(row) =>
              setDrill({
                title: t(row.name),
                ref: row.id.toUpperCase(),
                tone: row.tone,
                status: `${row.sanctioned - row.doctors} ${t(bi('vacancies', 'காலியிடம்'))}`,
                facts: [
                  { label: bi('Type', 'வகை'), value: t(row.type) },
                  { label: bi('Doctors in position', 'பணியில் உள்ள மருத்துவர்'), value: `${row.doctors} / ${row.sanctioned}` },
                  { label: bi('Beds', 'படுக்கைகள்'), value: `${row.occupied} / ${row.beds}` },
                  { label: bi('Free beds', 'காலி படுக்கை'), value: num(row.beds - row.occupied) },
                  { label: bi('Oxygen', 'ஆக்சிஜன்'), value: 'Plant operational' },
                  { label: bi('Drug stock', 'மருந்து இருப்பு'), value: '91%' },
                ],
                officer: { name: 'Dr. K. Sundaram', designation: DESIG.dms, phone: '+914343241100' },
                audit: { updated: '24 Oct 08:45', by: 'Hospital MIS', source: SRC.health },
                actions: [{ label: bi('Fill vacancy', 'காலியிடம் நிரப்பு'), icon: 'person_add', variant: 'accent' }],
              })
            }
          />
        </Panel>

        <Panel>
          <PanelHead
            icon="pregnant_woman"
            title={bi('Institutional deliveries', 'மருத்துவமனை பிரசவம்')}
            note={bi('Delivered against registered', 'பதிவை ஒப்பிட பிரசவம்')}
          />
          <ColumnChart
            data={DELIVERIES}
            seriesA={bi('Institutional', 'மருத்துவமனை')}
            seriesB={bi('Registered', 'பதிவு')}
            height={170}
          />
        </Panel>
      </div>

      <DrillDrawer drill={drill} onClose={() => setDrill(null)} />
    </div>
  )
}
