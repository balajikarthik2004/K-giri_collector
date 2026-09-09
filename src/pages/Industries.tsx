import { useState } from 'react'
import { bi, num, pct, useI18n, type Bi } from '../i18n'
import { PageHead } from '../components/ui/PageHead'
import { Panel, PanelHead, Stat, StatGrid, Status, Tag } from '../components/ui/Primitives'
import { BarList, ColumnChart, Donut } from '../components/ui/Charts'
import { DataTable, type Column } from '../components/ui/DataTable'
import { DrillDrawer, type Drill } from '../components/ui/Drawer'
import { DESIG, MONTHS, SRC } from '../data/common'

type Estate = {
  id: string
  name: Bi
  plots: number
  allotted: number
  extent: string
  investmentCr: number
  jobs: number
  tone: 'good' | 'warning' | 'serious'
}

const ESTATES: Estate[] = [
  { id: 'hosur-1', name: bi('SIPCOT Hosur Phase I', 'சிப்காட் ஓசூர் கட்டம் I'), plots: 284, allotted: 284, extent: '412 ha', investmentCr: 4820, jobs: 42600, tone: 'good' },
  { id: 'hosur-2', name: bi('SIPCOT Hosur Phase II', 'சிப்காட் ஓசூர் கட்டம் II'), plots: 196, allotted: 181, extent: '386 ha', investmentCr: 3140, jobs: 28400, tone: 'good' },
  { id: 'hosur-3', name: bi('SIPCOT Hosur Phase III (EV)', 'சிப்காட் ஓசூர் கட்டம் III (மின்சார வாகனம்)'), plots: 148, allotted: 86, extent: '318 ha', investmentCr: 6240, jobs: 18200, tone: 'warning' },
  { id: 'pochampalli', name: bi('SIDCO Pochampalli estate', 'சிட்கோ போச்சம்பள்ளி'), plots: 92, allotted: 61, extent: '48 ha', investmentCr: 284, jobs: 3400, tone: 'serious' },
]

type Clearance = {
  id: string
  applicant: Bi
  sector: Bi
  stage: Bi
  ageDays: number
  investmentCr: number
  tone: 'good' | 'warning' | 'serious' | 'critical'
}

const CLEARANCES: Clearance[] = [
  { id: 'sw-1', applicant: bi('Ampere EV components', 'ஆம்பியர் மின்சார வாகன உதிரி'), sector: bi('EV ancillary', 'மின்சார வாகன துணை'), stage: bi('Fire NOC pending', 'தீயணைப்பு அனுமதி நிலுவை'), ageDays: 34, investmentCr: 420, tone: 'critical' },
  { id: 'sw-2', applicant: bi('Titan precision unit', 'டைட்டன் நுண் தொழில்நுட்பம்'), sector: bi('Engineering', 'பொறியியல்'), stage: bi('TNPCB consent', 'மாசுக்கட்டுப்பாடு ஒப்புதல்'), ageDays: 21, investmentCr: 186, tone: 'serious' },
  { id: 'sw-3', applicant: bi('Ashok Leyland vendor park', 'அசோக் லேலண்ட் விற்பனையாளர் பூங்கா'), sector: bi('Automotive', 'வாகனத் தொழில்'), stage: bi('Power feasibility', 'மின் சாத்தியக்கூறு'), ageDays: 14, investmentCr: 640, tone: 'warning' },
  { id: 'sw-4', applicant: bi('Krishnagiri food park', 'கிருஷ்ணகிரி உணவு பூங்கா'), sector: bi('Food processing', 'உணவு பதப்படுத்துதல்'), stage: bi('Approved', 'ஒப்புதல்'), ageDays: 6, investmentCr: 92, tone: 'good' },
]

const JOBS = [
  { label: MONTHS[0], a: 1240, b: 1600 },
  { label: MONTHS[1], a: 1860, b: 1600 },
  { label: MONTHS[2], a: 1420, b: 1600 },
  { label: MONTHS[3], a: 2140, b: 1600 },
  { label: MONTHS[4], a: 1980, b: 1600 },
  { label: MONTHS[5], a: 2260, b: 1600 },
]

const LOANS = [
  { label: bi('PMEGP sanctioned', 'பிரதமர் வேலைவாய்ப்பு ஒப்புதல்'), value: 428, note: '84%' },
  { label: bi('NEEDS sanctioned', 'நீட்ஸ் ஒப்புதல்'), value: 196, note: '71%' },
  { label: bi('Mudra loans', 'முத்ரா கடன்'), value: 3840, note: '92%' },
  { label: bi('Pending beyond 30 days', '30 நாட்களுக்கு மேல் நிலுவை'), value: 118, note: '' },
]

export function IndustriesPage() {
  const { t } = useI18n()
  const [drill, setDrill] = useState<Drill | null>(null)

  const estateColumns: Column<Estate>[] = [
    { key: 'name', head: bi('Estate', 'தொழில் வளாகம்'), text: (row) => t(row.name) },
    {
      key: 'plots',
      head: bi('Plots allotted', 'ஒதுக்கப்பட்ட மனை'),
      align: 'right',
      text: (row) => `${row.allotted} / ${row.plots}`,
      render: (row) => (
        <span className="flex flex-col items-end gap-1">
          <span className="font-label-sm text-label-sm font-bold tabular-nums">
            {row.allotted} / {row.plots}
          </span>
          <span className="block h-1.5 w-20 overflow-hidden rounded-full bg-surface-container">
            <span
              className="block h-full rounded-full bg-viz-1"
              style={{ width: `${(row.allotted / row.plots) * 100}%` }}
            />
          </span>
        </span>
      ),
    },
    { key: 'extent', head: bi('Extent', 'பரப்பு'), align: 'right', text: (row) => row.extent, minor: true },
    { key: 'inv', head: bi('Investment', 'முதலீடு'), align: 'right', text: (row) => `₹${num(row.investmentCr)} Cr` },
    { key: 'jobs', head: bi('Jobs', 'வேலைவாய்ப்பு'), align: 'right', text: (row) => num(row.jobs) },
  ]

  const clearanceColumns: Column<Clearance>[] = [
    { key: 'app', head: bi('Applicant', 'விண்ணப்பதாரர்'), text: (row) => t(row.applicant) },
    { key: 'sector', head: bi('Sector', 'துறை'), text: (row) => t(row.sector), minor: true },
    { key: 'stage', head: bi('Stage', 'நிலை'), text: (row) => t(row.stage) },
    { key: 'inv', head: bi('Investment', 'முதலீடு'), align: 'right', text: (row) => `₹${num(row.investmentCr)} Cr` },
    {
      key: 'age',
      head: bi('Age', 'காலம்'),
      align: 'right',
      text: (row) => `${row.ageDays} d`,
      render: (row) => <Status tone={row.tone} label={`${row.ageDays} d`} />,
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <PageHead
        title={bi('Industry, investment & jobs', 'தொழில், முதலீடு & வேலைவாய்ப்பு')}
        note={bi('Hosur growth corridor · SIPCOT, single window, skilling', 'ஓசூர் வளர்ச்சி வழித்தடம் · சிப்காட், ஒற்றைச் சாளரம், திறன் பயிற்சி')}
        icon="factory"
      />

      <StatGrid>
        <Stat label={bi('Live investment', 'நடப்பு முதலீடு')} value="₹14,484" unit="Cr" delta="+12%" deltaTone="good" />
        <Stat label={bi('Jobs created (FY)', 'உருவான வேலைவாய்ப்பு')} value={num(10900)} delta={t(bi('vs 9,600 MoU', 'ஒப்பந்தம் 9,600'))} deltaTone="good" meter={100} meterTone="good" />
        <Stat label={bi('Plots allotted', 'ஒதுக்கப்பட்ட மனை')} value="612 / 720" delta="85%" deltaTone="good" meter={85} />
        <Stat label={bi('Clearances pending', 'நிலுவை அனுமதி')} value="28" delta={t(bi('4 beyond 30 d', '4 · 30 நாள் மேல்'))} deltaTone="bad" />
        <Stat label={bi('Industrial disputes', 'தொழில் தகராறு')} value="7" delta={t(bi('2 conciliation', '2 சமரசம்'))} deltaTone="bad" />
      </StatGrid>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <PanelHead
            icon="domain"
            title={bi('Industrial estates', 'தொழில் வளாகங்கள்')}
            note={bi('SIPCOT and SIDCO allotment status', 'சிப்காட் மற்றும் சிட்கோ ஒதுக்கீடு நிலை')}
          />
          <DataTable
            columns={estateColumns}
            rows={ESTATES}
            rowKey={(row) => row.id}
            searchable={false}
            exportName="krishnagiri-industrial-estates"
            onRowClick={(row) =>
              setDrill({
                title: t(row.name),
                ref: row.id.toUpperCase(),
                tone: row.tone,
                status: pct((row.allotted / row.plots) * 100, 0),
                facts: [
                  { label: bi('Plots', 'மனைகள்'), value: `${row.allotted} / ${row.plots}` },
                  { label: bi('Extent', 'பரப்பு'), value: row.extent },
                  { label: bi('Investment', 'முதலீடு'), value: `₹${num(row.investmentCr)} Cr` },
                  { label: bi('Employment', 'வேலைவாய்ப்பு'), value: num(row.jobs) },
                  { label: bi('Power load', 'மின் தேவை'), value: '186 MVA' },
                  { label: bi('Effluent plant', 'கழிவுநீர் சுத்திகரிப்பு'), value: 'Operational' },
                ],
                officer: { name: 'R. Kalaiselvan', designation: DESIG.gm, phone: '+914344260100' },
                audit: { updated: '23 Oct 16:00', by: 'SIPCOT estate office', source: SRC.sipcot },
                actions: [{ label: bi('Convene review', 'ஆய்வுக் கூட்டம்'), icon: 'groups', variant: 'accent' }],
              })
            }
          />
        </Panel>

        <Panel>
          <PanelHead
            icon="pending_actions"
            title={bi('Single window pipeline', 'ஒற்றைச் சாளர வரிசை')}
            note={bi('By stage', 'நிலை வாரியாக')}
          />
          <Donut
            centerValue="28"
            centerLabel={bi('pending', 'நிலுவை')}
            data={[
              { label: bi('Statutory NOC', 'சட்டப்பூர்வ அனுமதி'), value: 12 },
              { label: bi('Utilities', 'உள்கட்டமைப்பு'), value: 9 },
              { label: bi('Land / layout', 'நிலம் / வரைபடம்'), value: 7 },
            ]}
          />
          <div className="mt-4 flex flex-wrap gap-1.5">
            <Tag label={bi('Avg clearance 19 days', 'சராசரி அனுமதி 19 நாட்கள்')} />
            <Tag label={bi('SLA 30 days', 'கால வரம்பு 30 நாட்கள்')} />
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel>
          <PanelHead
            icon="how_to_reg"
            title={bi('Clearances awaiting decision', 'முடிவுக்காக காத்திருக்கும் அனுமதிகள்')}
            note={bi('Ranked by age', 'காலம் அடிப்படையில்')}
          />
          <DataTable
            columns={clearanceColumns}
            rows={CLEARANCES}
            rowKey={(row) => row.id}
            searchable={false}
            dense
            exportName="krishnagiri-clearances"
            onRowClick={(row) =>
              setDrill({
                title: t(row.applicant),
                ref: row.id.toUpperCase(),
                tone: row.tone,
                status: row.stage,
                facts: [
                  { label: bi('Sector', 'துறை'), value: t(row.sector) },
                  { label: bi('Investment', 'முதலீடு'), value: `₹${num(row.investmentCr)} Cr` },
                  { label: bi('Pending since', 'நிலுவை நாட்கள்'), value: `${row.ageDays} days` },
                  { label: bi('Jobs projected', 'எதிர்பார்க்கும் வேலை'), value: '1,240' },
                ],
                officer: { name: 'R. Kalaiselvan', designation: DESIG.gm, phone: '+914344260100' },
                audit: { updated: '24 Oct 07:30', by: 'Single window portal', source: SRC.sipcot },
                actions: [{ label: bi('Clear now', 'இப்போது அனுமதி'), icon: 'check_circle', variant: 'primary' }],
              })
            }
          />
        </Panel>

        <Panel>
          <PanelHead
            icon="work"
            title={bi('Placements vs monthly target', 'வேலைவாய்ப்பு / மாத இலக்கு')}
            note={bi('Naan Mudhalvan and district skill missions', 'நான் முதல்வன் மற்றும் மாவட்ட திறன் திட்டம்')}
          />
          <ColumnChart
            data={JOBS}
            seriesA={bi('Placed', 'வேலை பெற்றோர்')}
            seriesB={bi('Target', 'இலக்கு')}
            height={160}
          />
          <div className="mt-4">
            <p className="mb-2 font-label-sm text-label-sm font-bold text-on-surface-variant">
              {t(bi('Credit-linked schemes', 'கடன் இணைந்த திட்டங்கள்'))}
            </p>
            <BarList data={LOANS} />
          </div>
        </Panel>
      </div>

      <DrillDrawer drill={drill} onClose={() => setDrill(null)} />
    </div>
  )
}
