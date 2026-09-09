import { useState } from 'react'
import { bi, num, pct, useI18n, type Bi } from '../i18n'
import { PageHead } from '../components/ui/PageHead'
import { Panel, PanelHead, Stat, StatGrid, Status } from '../components/ui/Primitives'
import { ColumnChart, Donut, SERIES } from '../components/ui/Charts'
import { DataTable, type Column } from '../components/ui/DataTable'
import { DrillDrawer, type Drill } from '../components/ui/Drawer'
import { DESIG, MONTHS, SRC } from '../data/common'

type Budget = {
  id: string
  head: Bi
  allocCr: number
  spentCr: number
  ucPendingCr: number
  tone: 'good' | 'warning' | 'serious' | 'critical'
}

const BUDGET: Budget[] = [
  { id: 'b1', head: bi('Rural development', 'ஊரக வளர்ச்சி'), allocCr: 412.6, spentCr: 348.2, ucPendingCr: 41.2, tone: 'good' },
  { id: 'b2', head: bi('Highways & rural roads', 'நெடுஞ்சாலை & ஊரக சாலை'), allocCr: 286.4, spentCr: 194.8, ucPendingCr: 62.4, tone: 'warning' },
  { id: 'b3', head: bi('School education', 'பள்ளிக் கல்வி'), allocCr: 218.2, spentCr: 186.4, ucPendingCr: 18.6, tone: 'good' },
  { id: 'b4', head: bi('Health & family welfare', 'சுகாதாரம் & குடும்ப நலம்'), allocCr: 164.8, spentCr: 121.6, ucPendingCr: 28.4, tone: 'warning' },
  { id: 'b5', head: bi('Municipal administration', 'நகராட்சி நிர்வாகம்'), allocCr: 148.2, spentCr: 84.6, ucPendingCr: 44.8, tone: 'serious' },
  { id: 'b6', head: bi('Adi Dravidar welfare', 'ஆதிதிராவிடர் நலன்'), allocCr: 96.4, spentCr: 44.2, ucPendingCr: 31.6, tone: 'critical' },
  { id: 'b7', head: bi('District Mineral Foundation', 'மாவட்ட கனிம நிதி'), allocCr: 62.8, spentCr: 38.4, ucPendingCr: 9.2, tone: 'warning' },
]

const SPEND = [
  { label: MONTHS[0], a: 142, b: 168 },
  { label: MONTHS[1], a: 168, b: 168 },
  { label: MONTHS[2], a: 154, b: 168 },
  { label: MONTHS[3], a: 186, b: 168 },
  { label: MONTHS[4], a: 172, b: 168 },
  { label: MONTHS[5], a: 196, b: 168 },
]

type Audit = {
  id: string
  para: string
  subject: Bi
  dept: Bi
  year: string
  amountCr: number
  tone: 'warning' | 'serious' | 'critical'
}

const AUDIT: Audit[] = [
  { id: 'a1', para: 'AG/2021-22/14', subject: bi('Excess payment in road works', 'சாலைப் பணிகளில் அதிகப்படியான கட்டணம்'), dept: bi('Highways', 'நெடுஞ்சாலை'), year: '2021-22', amountCr: 4.82, tone: 'critical' },
  { id: 'a2', para: 'AG/2022-23/07', subject: bi('Non-production of vouchers', 'ரசீதுகள் சமர்ப்பிக்கப்படவில்லை'), dept: bi('Rural development', 'ஊரக வளர்ச்சி'), year: '2022-23', amountCr: 2.14, tone: 'serious' },
  { id: 'a3', para: 'AG/2022-23/22', subject: bi('Idle machinery procurement', 'பயன்படுத்தப்படாத இயந்திர கொள்முதல்'), dept: bi('Municipal administration', 'நகராட்சி நிர்வாகம்'), year: '2022-23', amountCr: 1.96, tone: 'serious' },
  { id: 'a4', para: 'LF/2023-24/03', subject: bi('Delay in UC submission', 'பயன்பாட்டுச் சான்று தாமதம்'), dept: bi('Adi Dravidar welfare', 'ஆதிதிராவிடர் நலன்'), year: '2023-24', amountCr: 8.42, tone: 'critical' },
  { id: 'a5', para: 'LF/2023-24/11', subject: bi('Stock register not maintained', 'இருப்பு பதிவேடு பராமரிக்கப்படவில்லை'), dept: bi('Health', 'சுகாதாரம்'), year: '2023-24', amountCr: 0.64, tone: 'warning' },
]

export function FinancePage() {
  const { t } = useI18n()
  const [drill, setDrill] = useState<Drill | null>(null)

  const totalAlloc = BUDGET.reduce((sum, row) => sum + row.allocCr, 0)
  const totalSpent = BUDGET.reduce((sum, row) => sum + row.spentCr, 0)
  const totalUc = BUDGET.reduce((sum, row) => sum + row.ucPendingCr, 0)

  const budgetColumns: Column<Budget>[] = [
    { key: 'head', head: bi('Department', 'துறை'), text: (row) => t(row.head) },
    { key: 'alloc', head: bi('Allocation', 'ஒதுக்கீடு'), align: 'right', text: (row) => `₹${num(row.allocCr, 1)} Cr` },
    { key: 'spent', head: bi('Spent', 'செலவு'), align: 'right', text: (row) => `₹${num(row.spentCr, 1)} Cr` },
    {
      key: 'util',
      head: bi('Utilisation', 'பயன்பாடு'),
      align: 'right',
      text: (row) => pct((row.spentCr / row.allocCr) * 100, 0),
      render: (row) => (
        <span className="flex flex-col items-end gap-1">
          <Status tone={row.tone} label={pct((row.spentCr / row.allocCr) * 100, 0)} />
          <span className="block h-1.5 w-20 overflow-hidden rounded-full bg-surface-container">
            <span
              className="block h-full rounded-full bg-viz-1"
              style={{ width: `${(row.spentCr / row.allocCr) * 100}%` }}
            />
          </span>
        </span>
      ),
    },
    {
      key: 'uc',
      head: bi('UC pending', 'சான்று நிலுவை'),
      align: 'right',
      text: (row) => `₹${num(row.ucPendingCr, 1)} Cr`,
      minor: true,
    },
  ]

  const auditColumns: Column<Audit>[] = [
    { key: 'para', head: bi('Para', 'பத்தி'), text: (row) => row.para },
    { key: 'subject', head: bi('Subject', 'பொருள்'), text: (row) => t(row.subject) },
    { key: 'dept', head: bi('Department', 'துறை'), text: (row) => t(row.dept), minor: true },
    { key: 'year', head: bi('Year', 'ஆண்டு'), text: (row) => row.year, minor: true },
    {
      key: 'amt',
      head: bi('Amount', 'தொகை'),
      align: 'right',
      text: (row) => `₹${num(row.amountCr, 2)} Cr`,
      render: (row) => <Status tone={row.tone} label={`₹${num(row.amountCr, 2)} Cr`} />,
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <PageHead
        title={bi('Finance & audit', 'நிதி & தணிக்கை')}
        note={bi('Budget utilisation, treasury and open audit paras', 'நிதி பயன்பாடு, கருவூலம் மற்றும் நிலுவை தணிக்கை பத்திகள்')}
        icon="account_balance_wallet"
      />

      <StatGrid>
        <Stat label={bi('District allocation', 'மாவட்ட ஒதுக்கீடு')} value={`₹${num(totalAlloc, 0)}`} unit="Cr" />
        <Stat label={bi('Utilisation', 'பயன்பாடு')} value={pct((totalSpent / totalAlloc) * 100, 1)} delta={`₹${num(totalSpent, 0)} Cr`} deltaTone="good" meter={(totalSpent / totalAlloc) * 100} />
        <Stat label={bi('UCs pending with state', 'மாநிலத்திடம் நிலுவை சான்று')} value={`₹${num(totalUc, 1)}`} unit="Cr" delta="18 UCs" deltaTone="bad" />
        <Stat label={bi('Treasury bills held', 'கருவூல மசோதா நிலுவை')} value="34" delta="₹22.6 Cr" deltaTone="bad" />
        <Stat label={bi('Open audit paras', 'நிலுவை தணிக்கை பத்தி')} value="41" delta={t(bi('9 over 3 years', '3 ஆண்டுக்கு மேல் 9'))} deltaTone="bad" />
      </StatGrid>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <PanelHead
            icon="savings"
            title={bi('Budget utilisation by department', 'துறைவாரி நிதி பயன்பாடு')}
            note={bi('Financial year to date', 'நிதியாண்டு இதுவரை')}
          />
          <DataTable
            columns={budgetColumns}
            rows={BUDGET}
            rowKey={(row) => row.id}
            exportName="krishnagiri-budget-utilisation"
            onRowClick={(row) =>
              setDrill({
                title: t(row.head),
                ref: row.id.toUpperCase(),
                tone: row.tone,
                status: pct((row.spentCr / row.allocCr) * 100, 0),
                facts: [
                  { label: bi('Allocation', 'ஒதுக்கீடு'), value: `₹${num(row.allocCr, 1)} Cr` },
                  { label: bi('Spent', 'செலவு'), value: `₹${num(row.spentCr, 1)} Cr` },
                  { label: bi('Balance', 'மீதி'), value: `₹${num(row.allocCr - row.spentCr, 1)} Cr` },
                  { label: bi('UC pending', 'சான்று நிலுவை'), value: `₹${num(row.ucPendingCr, 1)} Cr` },
                  { label: bi('Bills in treasury', 'கருவூல மசோதா'), value: '6' },
                  { label: bi('Schemes running', 'இயங்கும் திட்டங்கள்'), value: '14' },
                ],
                officer: { name: 'P. Anandhi', designation: DESIG.ao, phone: '+914343235500' },
                audit: { updated: '23 Oct 19:00', by: 'IFHRMS nightly extract', source: SRC.treasury },
                actions: [{ label: bi('Chase UC', 'சான்று கோரு'), icon: 'forward_to_inbox', variant: 'accent' }],
              })
            }
          />
        </Panel>

        <Panel>
          <PanelHead
            icon="pie_chart"
            title={bi('Where the money went', 'நிதி பயன்பாட்டு பிரிவு')}
            note={bi('Expenditure share', 'செலவு பங்கு')}
          />
          <Donut
            centerValue={`₹${num(totalSpent, 0)}`}
            centerLabel={bi('Cr spent', 'கோடி செலவு')}
            data={[
              { label: bi('Rural development', 'ஊரக வளர்ச்சி'), value: 348 },
              { label: bi('Roads', 'சாலைகள்'), value: 195 },
              { label: bi('Others', 'பிற'), value: 475 },
            ]}
          />
          <div className="mt-4">
            <p className="mb-1.5 font-label-sm text-label-sm font-bold text-on-surface-variant">
              {t(bi('Monthly expenditure vs phasing', 'மாதாந்திர செலவு / திட்ட வரையறை'))}
            </p>
            <ColumnChart
              data={SPEND}
              seriesA={bi('Spent', 'செலவு')}
              seriesB={bi('Phased', 'வரையறை')}
              unit=" Cr"
              height={140}
            />
          </div>
        </Panel>
      </div>

      <Panel>
        <PanelHead
          icon="rule"
          title={bi('Open audit paras', 'நிலுவை தணிக்கை பத்திகள்')}
          note={bi('AG and Local Fund audit', 'கணக்கு தணிக்கை மற்றும் உள்ளாட்சி நிதி தணிக்கை')}
        />
        <DataTable
          columns={auditColumns}
          rows={AUDIT}
          rowKey={(row) => row.id}
          exportName="krishnagiri-audit-paras"
          onRowClick={(row) =>
            setDrill({
              title: t(row.subject),
              ref: row.para,
              tone: row.tone,
              status: row.year,
              facts: [
                { label: bi('Department', 'துறை'), value: t(row.dept) },
                { label: bi('Audit year', 'தணிக்கை ஆண்டு'), value: row.year },
                { label: bi('Amount', 'தொகை'), value: `₹${num(row.amountCr, 2)} Cr` },
                { label: bi('Reply status', 'பதில் நிலை'), value: 'Draft with HoD' },
              ],
              officer: { name: 'P. Anandhi', designation: DESIG.ao, phone: '+914343235500' },
              audit: { updated: '18 Oct 12:00', by: 'District audit cell', source: SRC.treasury },
              actions: [{ label: bi('Call for reply', 'பதில் கோரு'), icon: 'mail', variant: 'primary' }],
            })
          }
        />
      </Panel>

      <Panel>
        <PanelHead
          icon="stacked_bar_chart"
          title={bi('Utilisation ranking', 'பயன்பாட்டு தரவரிசை')}
          note={bi('Lowest utilisation needs review', 'குறைந்த பயன்பாடு ஆய்வுக்குரியது')}
        />
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[...BUDGET]
            .sort((a, b) => a.spentCr / a.allocCr - b.spentCr / b.allocCr)
            .slice(0, 4)
            .map((row, index) => (
              <li key={row.id} className="rounded bg-surface-container-low p-3">
                <p className="font-label-sm text-label-sm text-on-surface-variant">{t(row.head)}</p>
                <p className="mt-1 font-headline-sm text-headline-sm font-bold text-on-surface">
                  {pct((row.spentCr / row.allocCr) * 100, 0)}
                </p>
                <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-surface-container">
                  <span
                    className="block h-full rounded-full"
                    style={{
                      width: `${(row.spentCr / row.allocCr) * 100}%`,
                      background: SERIES[index % SERIES.length],
                    }}
                  />
                </span>
              </li>
            ))}
        </ul>
      </Panel>

      <DrillDrawer drill={drill} onClose={() => setDrill(null)} />
    </div>
  )
}
