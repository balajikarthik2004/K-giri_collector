import { useState } from 'react'
import { bi, num, useI18n } from '../i18n'
import { ui } from '../i18n/ui'
import { PageHead } from '../components/ui/PageHead'
import { Panel, PanelHead, Segmented, Stat, StatGrid, Status } from '../components/ui/Primitives'
import { BarList, ColumnChart, SERIES } from '../components/ui/Charts'
import { DataTable, type Column } from '../components/ui/DataTable'
import { DrillDrawer, type Drill } from '../components/ui/Drawer'
import { DESIG, MONTHS, SRC, TALUK_DESKS, TALUKS } from '../data/common'

type TalukRow = {
  id: keyof typeof TALUK_DESKS
  taluk: (typeof TALUKS)[keyof typeof TALUKS]
  patta: number
  beyondSla: number
  fmb: number
  aRegister: number
  encroach: number
  oldestDays: number
}

/**
 * Taluk register. The columns are designed to add up to the tiles above the
 * table: patta 3,038 · beyond SLA 214 · FMB 842 · A-Register 396 · encroachment
 * 287. `oldestDays` is the age of the single oldest live file in that taluk.
 */
const ROWS: TalukRow[] = [
  { id: 'hosur', taluk: TALUKS.hosur, patta: 812, beyondSla: 74, fmb: 208, aRegister: 96, encroach: 63, oldestDays: 96 },
  { id: 'krishnagiri', taluk: TALUKS.krishnagiri, patta: 604, beyondSla: 41, fmb: 166, aRegister: 71, encroach: 48, oldestDays: 74 },
  { id: 'shoolagiri', taluk: TALUKS.shoolagiri, patta: 431, beyondSla: 33, fmb: 121, aRegister: 54, encroach: 39, oldestDays: 68 },
  { id: 'denkanikottai', taluk: TALUKS.denkanikottai, patta: 388, beyondSla: 28, fmb: 118, aRegister: 62, encroach: 71, oldestDays: 61 },
  { id: 'pochampalli', taluk: TALUKS.pochampalli, patta: 296, beyondSla: 17, fmb: 84, aRegister: 38, encroach: 22, oldestDays: 48 },
  { id: 'uthangarai', taluk: TALUKS.uthangarai, patta: 274, beyondSla: 14, fmb: 79, aRegister: 44, encroach: 26, oldestDays: 42 },
  { id: 'bargur', taluk: TALUKS.bargur, patta: 233, beyondSla: 7, fmb: 66, aRegister: 31, encroach: 18, oldestDays: 31 },
]

const CATEGORIES = [
  { label: bi('Patta transfer', 'பட்டா மாற்றம்'), value: 3038 },
  { label: bi('Sub-division', 'உட்பிரிவு'), value: 1142 },
  { label: bi('FMB sketch', 'எஃப்.எம்.பி வரைபடம்'), value: 842 },
  { label: bi('2C patta (natham)', '2C பட்டா (நத்தம்)'), value: 396 },
  { label: bi('A-Register correction', 'அ-பதிவேடு திருத்தம்'), value: 396 },
]

const SRO = [
  { label: MONTHS[0], a: 18.2, b: 23 },
  { label: MONTHS[1], a: 21.4, b: 23 },
  { label: MONTHS[2], a: 19.8, b: 24 },
  { label: MONTHS[3], a: 23.6, b: 24 },
  { label: MONTHS[4], a: 22.1, b: 24 },
  { label: MONTHS[5], a: 20.4, b: 24 },
]

type LaRow = {
  id: string
  project: ReturnType<typeof bi>
  agency: ReturnType<typeof bi>
  extent: string
  awarded: number
  paid: number
  stage: ReturnType<typeof bi>
  holders: number
  villages: string
  tone: 'good' | 'warning' | 'serious' | 'critical'
}

const LA: LaRow[] = [
  { id: 'nhai-1', project: bi('Hosur ring bypass Segment II', 'ஓசூர் வளைய புறவழிச்சாலை பகுதி II'), agency: bi('NHAI', 'தேசிய நெடுஞ்சாலை ஆணையம்'), extent: '42.6 ha', awarded: 86.4, paid: 78.0, stage: bi('Award payment', 'இழப்பீடு வழங்கல்'), holders: 184, villages: 'Moranapalli, Zuzuvadi', tone: 'critical' },
  { id: 'sipcot-3', project: bi('SIPCOT Hosur Phase III', 'சிப்காட் ஓசூர் கட்டம் III'), agency: bi('SIPCOT', 'சிப்காட்'), extent: '318 ha', awarded: 412.0, paid: 366.5, stage: bi('Possession', 'கையகப்படுத்தல்'), holders: 642, villages: 'Belathur, Onnalvadi', tone: 'warning' },
  { id: 'corridor', project: bi('Chennai–Bengaluru corridor link', 'சென்னை–பெங்களூரு தொழில் வழித்தட இணைப்பு'), agency: bi('CBIC', 'தொழில் வழித்தட நிறுவனம்'), extent: '96 ha', awarded: 121.8, paid: 121.8, stage: bi('Completed', 'நிறைவு'), holders: 212, villages: 'Samalpallam, Achettipalli', tone: 'good' },
  { id: 'rail', project: bi('Hosur–Thally road widening', 'ஓசூர்–தளி சாலை அகலப்படுத்தல்'), agency: bi('Highways', 'நெடுஞ்சாலைத் துறை'), extent: '18.2 ha', awarded: 34.2, paid: 19.6, stage: bi('Sec 11 notification', 'பிரிவு 11 அறிவிக்கை'), holders: 96, villages: 'Kothapalli, Madhagondapalli', tone: 'serious' },
]

export function RevenuePage() {
  const { t } = useI18n()
  const [drill, setDrill] = useState<Drill | null>(null)
  const [level, setLevel] = useState<'taluk' | 'category'>('taluk')

  const columns: Column<TalukRow>[] = [
    {
      key: 'taluk',
      head: bi('Taluk', 'வட்டம்'),
      text: (row) => t(row.taluk),
      render: (row) => (
        <span className="flex flex-col">
          <span className="font-label-md text-label-md font-bold">{t(row.taluk)}</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            {TALUK_DESKS[row.id].name}
          </span>
        </span>
      ),
    },
    { key: 'patta', head: bi('Patta pending', 'பட்டா நிலுவை'), align: 'right', text: (row) => num(row.patta) },
    {
      key: 'sla',
      head: bi('Overdue', 'காலம் தாண்டியவை'),
      align: 'right',
      text: (row) => num(row.beyondSla),
      render: (row) => (
        <Status
          tone={row.beyondSla > 60 ? 'critical' : row.beyondSla > 30 ? 'serious' : 'good'}
          label={num(row.beyondSla)}
        />
      ),
    },
    { key: 'fmb', head: bi('FMB', 'எஃப்.எம்.பி'), align: 'right', text: (row) => num(row.fmb) },
    { key: 'areg', head: bi('A-Register', 'அ-பதிவேடு'), align: 'right', text: (row) => num(row.aRegister), minor: true },
    { key: 'enc', head: bi('Encroachment', 'ஆக்கிரமிப்பு'), align: 'right', text: (row) => num(row.encroach) },
  ]

  const laColumns: Column<LaRow>[] = [
    { key: 'project', head: bi('Project', 'திட்டம்'), text: (row) => t(row.project) },
    { key: 'agency', head: bi('Agency', 'நிறுவனம்'), text: (row) => t(row.agency), minor: true },
    { key: 'extent', head: bi('Extent', 'பரப்பு'), align: 'right', text: (row) => row.extent },
    {
      key: 'paid',
      head: bi('Compensation paid', 'இழப்பீடு வழங்கியது'),
      align: 'right',
      text: (row) => `₹${num(row.paid, 1)} / ${num(row.awarded, 1)} Cr`,
      render: (row) => (
        <span className="flex flex-col items-end gap-1">
          <span className="font-label-sm text-label-sm font-bold tabular-nums">
            ₹{num(row.paid, 1)} / {num(row.awarded, 1)} Cr
          </span>
          <span className="block h-1.5 w-24 overflow-hidden rounded-full bg-surface-container">
            <span
              className="block h-full rounded-full bg-viz-1"
              style={{ width: `${(row.paid / row.awarded) * 100}%` }}
            />
          </span>
        </span>
      ),
    },
    {
      key: 'stage',
      head: bi('Stage', 'நிலை'),
      text: (row) => t(row.stage),
      render: (row) => <Status tone={row.tone} label={row.stage} />,
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <PageHead
        title={bi('Revenue & land administration', 'வருவாய் & நில நிர்வாகம்')}
        note={bi('7 taluks · RDO and Tahsildar level pendency', '7 வட்டங்கள் · கோட்டாட்சியர் மற்றும் வட்டாட்சியர் நிலை நிலுவை')}
        icon="real_estate_agent"
      />

      <StatGrid>
        <Stat label={bi('Patta transfers pending', 'பட்டா மாற்ற நிலுவை')} value={num(3038)} delta={t(bi('214 overdue', '214 காலம் தாண்டியவை'))} deltaTone="bad" />
        <Stat label={bi('FMB sketch requests', 'எஃப்.எம்.பி கோரிக்கை')} value={num(842)} footnote={bi('Avg 18 days', 'சராசரி 18 நாட்கள்')} />
        <Stat label={bi('SRO collection', 'சார்பதிவாளர் வசூல்')} value="₹125.5" unit="Cr" delta="88.4%" deltaTone="good" meter={88.4} />
        <Stat label={bi('Encroachment cases', 'ஆக்கிரமிப்பு வழக்குகள்')} value={num(287)} footnote={bi('Natham & poromboke', 'நத்தம் & புறம்போக்கு')} />
        <Stat label={bi('Land acquisition', 'நில கையகப்படுத்தல்')} value="4" unit={t(bi('projects', 'திட்டங்கள்'))} footnote={bi('3 live · ₹654 Cr awarded', '3 நடப்பில் · ₹654 கோடி இழப்பீடு')} />
      </StatGrid>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <PanelHead
            icon="table_chart"
            title={bi('Pending cases by taluk', 'வட்டவாரி நிலுவை வழக்குகள்')}
            note={bi('Tap a row for the officer holding the file', 'கோப்பை வைத்திருக்கும் அலுவலரைக் காண வரிசையைத் தொடவும்')}
            actions={
              <Segmented
                value={level}
                onChange={setLevel}
                options={[
                  { value: 'taluk', label: ui.taluk },
                  { value: 'category', label: bi('Category', 'வகை') },
                ]}
              />
            }
          />
          {level === 'taluk' ? (
            <DataTable
              columns={columns}
              rows={ROWS}
              rowKey={(row) => row.id}
              exportName="krishnagiri-revenue-pendency"
              onRowClick={(row) =>
                setDrill({
                  title: t(row.taluk),
                  ref: `REV/${row.id.toUpperCase()}`,
                  tone: row.beyondSla > 60 ? 'critical' : 'warning',
                  status: bi('Pending case review', 'நிலுவை வழக்கு ஆய்வு'),
                  facts: [
                    { label: bi('Patta pending', 'பட்டா நிலுவை'), value: num(row.patta) },
                    { label: bi('Overdue', 'காலம் தாண்டியவை'), value: num(row.beyondSla) },
                    { label: bi('FMB sketches', 'எஃப்.எம்.பி'), value: num(row.fmb) },
                    { label: bi('A-Register', 'அ-பதிவேடு'), value: num(row.aRegister) },
                    { label: bi('Encroachment', 'ஆக்கிரமிப்பு'), value: num(row.encroach) },
                    { label: bi('Oldest file', 'மிகப் பழைய கோப்பு'), value: `${num(row.oldestDays)} ${t(ui.days)}` },
                  ],
                  officer: {
                    name: TALUK_DESKS[row.id].name,
                    designation: DESIG.tahsildar,
                    phone: TALUK_DESKS[row.id].phone,
                  },
                  audit: { updated: '24 Oct 08:30', by: 'Star 2.0 nightly sync', source: SRC.eservices },
                  actions: [{ label: bi('Issue directive', 'உத்தரவு பிறப்பி'), icon: 'campaign', variant: 'accent' }],
                })
              }
            />
          ) : (
            <BarList data={CATEGORIES} unit="" />
          )}
        </Panel>

        <Panel>
          <PanelHead
            icon="payments"
            title={bi('Sub-registrar collection', 'சார்பதிவாளர் வசூல்')}
            note={bi('₹ crore against monthly target', 'மாதாந்திர இலக்கை ஒப்பிட ₹ கோடி')}
          />
          <ColumnChart
            data={SRO}
            seriesA={bi('Collected', 'வசூல்')}
            seriesB={bi('Target', 'இலக்கு')}
            unit=" Cr"
            height={160}
          />
          <div className="mt-3 flex flex-col gap-1 rounded bg-surface-container-low p-2.5">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {t(bi('May–Oct against target', 'மே–அக் இலக்கை ஒப்பிட'))}
            </span>
            <span className="font-label-md text-label-md font-bold text-on-surface">
              ₹125.5 Cr / ₹142 Cr · 88.4%
            </span>
          </div>
        </Panel>
      </div>

      <Panel>
        <PanelHead
          icon="architecture"
          title={bi('Land acquisition status', 'நில கையகப்படுத்தல் நிலை')}
          note={bi('NHAI, SIPCOT and industrial corridor projects', 'தே.நெ.ஆ, சிப்காட் மற்றும் தொழில் வழித்தட திட்டங்கள்')}
        />
        <DataTable
          columns={laColumns}
          rows={LA}
          rowKey={(row) => row.id}
          searchable={false}
          exportName="krishnagiri-land-acquisition"
          onRowClick={(row) =>
            setDrill({
              title: t(row.project),
              ref: row.id.toUpperCase(),
              tone: row.tone,
              status: row.stage,
              facts: [
                { label: bi('Agency', 'நிறுவனம்'), value: t(row.agency) },
                { label: bi('Extent', 'பரப்பு'), value: row.extent },
                { label: bi('Award value', 'இழப்பீட்டுத் தொகை'), value: `₹${num(row.awarded, 1)} Cr` },
                { label: bi('Disbursed', 'வழங்கியது'), value: `₹${num(row.paid, 1)} Cr` },
                {
                  label: bi('Beneficiaries', 'பயனாளிகள்'),
                  value: `${num(row.holders)} ${t(bi('patta holders', 'பட்டாதாரர்கள்'))}`,
                },
                { label: bi('Villages', 'கிராமங்கள்'), value: row.villages },
              ],
              officer: { name: 'K. Rajavel', designation: DESIG.dro, phone: '+914343233333' },
              audit: { updated: '23 Oct 17:40', by: 'Special Tahsildar (LA)', source: SRC.survey },
              actions: [{ label: bi('Release payment', 'தொகை விடுவி'), icon: 'send_money', variant: 'primary' }],
            })
          }
        />
      </Panel>

      <Panel>
        <PanelHead
          icon="dataset"
          title={bi('Backlog by case type', 'வழக்கு வகைவாரி நிலுவை')}
          note={bi('District total across all taluks', 'அனைத்து வட்டங்களின் மொத்தம்')}
        />
        <BarList
          data={CATEGORIES.map((item, index) => ({
            ...item,
            color: SERIES[index % SERIES.length],
          }))}
        />
      </Panel>

      <DrillDrawer drill={drill} onClose={() => setDrill(null)} />
    </div>
  )
}
