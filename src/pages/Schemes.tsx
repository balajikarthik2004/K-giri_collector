import { useState } from 'react'
import { bi, inr, num, pct, useI18n, type Bi } from '../i18n'
import { PageHead } from '../components/ui/PageHead'
import { Panel, PanelHead, Stat, StatGrid, Status } from '../components/ui/Primitives'
import { BarList, ColumnChart, SERIES } from '../components/ui/Charts'
import { DataTable, type Column } from '../components/ui/DataTable'
import { DrillDrawer, type Drill } from '../components/ui/Drawer'
import { BLOCKS, DESIG, MONTHS, SRC } from '../data/common'

type Scheme = {
  id: string
  name: Bi
  beneficiaries: number
  releasedCr: number
  successPct: number
  aadhaarGap: number
  tone: 'good' | 'warning' | 'serious' | 'critical'
}

const SCHEMES: Scheme[] = [
  { id: 'kmut', name: bi('Kalaignar Magalir Urimai Thogai', 'கலைஞர் மகளிர் உரிமைத் தொகை'), beneficiaries: 384210, releasedCr: 38.42, successPct: 99.6, aadhaarGap: 412, tone: 'good' },
  { id: 'pension', name: bi('Social security pensions', 'சமூகப் பாதுகாப்பு ஓய்வூதியம்'), beneficiaries: 71840, releasedCr: 8.62, successPct: 98.1, aadhaarGap: 1284, tone: 'warning' },
  { id: 'pmkisan', name: bi('PM-KISAN', 'பிரதமர் கிசான்'), beneficiaries: 128460, releasedCr: 25.69, successPct: 96.4, aadhaarGap: 2140, tone: 'serious' },
  { id: 'pmayg', name: bi('PMAY-G rural housing', 'பிரதமர் ஊரக வீட்டுவசதி'), beneficiaries: 4820, releasedCr: 62.4, successPct: 94.8, aadhaarGap: 88, tone: 'warning' },
  { id: 'solar', name: bi('CM Solar Powered Housing', 'முதலமைச்சர் சூரிய சக்தி வீடு'), beneficiaries: 1240, releasedCr: 18.6, successPct: 97.2, aadhaarGap: 24, tone: 'good' },
  { id: 'ration', name: bi('Ration card issuance', 'குடும்ப அட்டை வழங்கல்'), beneficiaries: 9640, releasedCr: 0, successPct: 91.3, aadhaarGap: 640, tone: 'serious' },
  { id: 'twowheeler', name: bi('Working women two-wheeler subsidy', 'உழைக்கும் மகளிர் இருசக்கர வாகன மானியம்'), beneficiaries: 2180, releasedCr: 5.4, successPct: 99.1, aadhaarGap: 12, tone: 'good' },
]

const DBT_TREND = [
  { label: MONTHS[0], a: 44.2 },
  { label: MONTHS[1], a: 48.6 },
  { label: MONTHS[2], a: 51.4 },
  { label: MONTHS[3], a: 47.9 },
  { label: MONTHS[4], a: 55.2 },
  { label: MONTHS[5], a: 59.1 },
]

const MGNREGS = BLOCKS.slice(0, 8).map((block, index) => ({
  label: block,
  value: [412000, 386000, 341000, 298000, 276000, 254000, 231000, 208000][index],
  note: `${[88, 84, 79, 74, 71, 68, 64, 59][index]}%`,
}))

type Flag = {
  id: string
  issue: Bi
  scheme: Bi
  count: number
  block: Bi
  tone: 'critical' | 'serious' | 'warning'
}

const FLAGS: Flag[] = [
  { id: 'f1', issue: bi('Aadhaar not seeded to account', 'ஆதார் கணக்குடன் இணைக்கப்படவில்லை'), scheme: bi('PM-KISAN', 'பிரதமர் கிசான்'), count: 2140, block: bi('Uthangarai', 'ஊத்தங்கரை'), tone: 'critical' },
  { id: 'f2', issue: bi('Duplicate beneficiary suspected', 'நகல் பயனாளி சந்தேகம்'), scheme: bi('Pensions', 'ஓய்வூதியம்'), count: 318, block: bi('Hosur', 'ஓசூர்'), tone: 'critical' },
  { id: 'f3', issue: bi('Account frozen / KYC lapsed', 'கணக்கு முடக்கம் / KYC காலாவதி'), scheme: bi('Magalir Urimai Thogai', 'மகளிர் உரிமைத் தொகை'), count: 412, block: bi('Thally', 'தளி'), tone: 'serious' },
  { id: 'f4', issue: bi('Deceased not de-listed', 'இறந்தவர் நீக்கப்படவில்லை'), scheme: bi('Pensions', 'ஓய்வூதியம்'), count: 96, block: bi('Bargur', 'பர்கூர்'), tone: 'serious' },
  { id: 'f5', issue: bi('Mobile number mismatch', 'கைபேசி எண் பொருந்தவில்லை'), scheme: bi('Ration card', 'குடும்ப அட்டை'), count: 640, block: bi('Krishnagiri', 'கிருஷ்ணகிரி'), tone: 'warning' },
]

export function SchemesPage() {
  const { t } = useI18n()
  const [drill, setDrill] = useState<Drill | null>(null)

  const columns: Column<Scheme>[] = [
    { key: 'name', head: bi('Scheme', 'திட்டம்'), text: (row) => t(row.name) },
    { key: 'ben', head: bi('Beneficiaries', 'பயனாளிகள்'), align: 'right', text: (row) => num(row.beneficiaries) },
    { key: 'rel', head: bi('Released', 'வழங்கியது'), align: 'right', text: (row) => (row.releasedCr ? inr(row.releasedCr) : '—') },
    {
      key: 'succ',
      head: bi('Txn success', 'பரிவர்த்தனை வெற்றி'),
      align: 'right',
      text: (row) => pct(row.successPct),
      render: (row) => <Status tone={row.tone} label={pct(row.successPct)} />,
    },
    {
      key: 'gap',
      head: bi('Aadhaar gaps', 'ஆதார் இடைவெளி'),
      align: 'right',
      text: (row) => num(row.aadhaarGap),
      minor: true,
    },
  ]

  const flagColumns: Column<Flag>[] = [
    { key: 'issue', head: bi('Exception', 'விதிவிலக்கு'), text: (row) => t(row.issue) },
    { key: 'scheme', head: bi('Scheme', 'திட்டம்'), text: (row) => t(row.scheme) },
    { key: 'block', head: bi('Block', 'ஒன்றியம்'), text: (row) => t(row.block), minor: true },
    {
      key: 'count',
      head: bi('Records', 'பதிவுகள்'),
      align: 'right',
      text: (row) => num(row.count),
      render: (row) => <Status tone={row.tone} label={num(row.count)} />,
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <PageHead
        title={bi('Schemes & direct benefit transfer', 'நலத்திட்டங்கள் & நேரடி பயன் வழங்கல்')}
        note={bi('Beneficiary coverage, disbursement and exception flags', 'பயனாளி பரவல், வழங்கல் மற்றும் விதிவிலக்கு எச்சரிக்கை')}
        icon="volunteer_activism"
      />

      <StatGrid>
        <Stat label={bi('Released today', 'இன்று வழங்கியது')} value="₹14.82" unit="Cr" delta="99.4%" deltaTone="good" meter={99.4} meterTone="good" />
        <Stat label={bi('Released this month', 'இந்த மாதம்')} value="₹59.1" unit="Cr" delta="+7%" deltaTone="good" />
        <Stat label={bi('Active beneficiaries', 'செயலில் உள்ள பயனாளிகள்')} value="6.02" unit={t(bi('lakh', 'லட்சம்'))} />
        <Stat label={bi('Failed transactions', 'தோல்வியுற்ற பரிவர்த்தனை')} value={num(1284)} delta={t(bi('re-push queued', 'மீள் அனுப்புதல்'))} deltaTone="bad" />
        <Stat label={bi('Aadhaar seeding gaps', 'ஆதார் இணைப்பு இடைவெளி')} value={num(3606)} delta={t(bi('5 blocks', '5 ஒன்றியம்'))} deltaTone="bad" />
      </StatGrid>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <PanelHead
            icon="fact_check"
            title={bi('Scheme-wise status', 'திட்டவாரி நிலை')}
            note={bi('Flagship schemes running in the district', 'மாவட்டத்தில் செயல்படும் முதன்மைத் திட்டங்கள்')}
          />
          <DataTable
            columns={columns}
            rows={SCHEMES}
            rowKey={(row) => row.id}
            exportName="krishnagiri-schemes"
            onRowClick={(row) =>
              setDrill({
                title: t(row.name),
                ref: row.id.toUpperCase(),
                tone: row.tone,
                status: pct(row.successPct),
                facts: [
                  { label: bi('Beneficiaries', 'பயனாளிகள்'), value: num(row.beneficiaries) },
                  { label: bi('Released FY', 'நிதியாண்டு வழங்கல்'), value: inr(row.releasedCr) },
                  { label: bi('Aadhaar gaps', 'ஆதார் இடைவெளி'), value: num(row.aadhaarGap) },
                  { label: bi('Blocks covered', 'ஒன்றியங்கள்'), value: '10 / 10' },
                  { label: bi('Last disbursement', 'கடைசி வழங்கல்'), value: '23 Oct 2024' },
                  { label: bi('Grievances open', 'நிலுவை மனுக்கள்'), value: '48' },
                ],
                officer: { name: 'D. Priya', designation: DESIG.dd, phone: '+914343240011' },
                audit: { updated: '24 Oct 06:00', by: 'PFMS reconciliation', source: SRC.dbt },
                actions: [{ label: bi('Re-push failed', 'தோல்வியை மீள் அனுப்பு'), icon: 'restart_alt', variant: 'primary' }],
              })
            }
          />
        </Panel>

        <Panel>
          <PanelHead
            icon="trending_up"
            title={bi('DBT outflow trend', 'நேரடி நிதி போக்கு')}
            note={bi('₹ crore per month', 'மாதம் ஒன்றுக்கு ₹ கோடி')}
          />
          <ColumnChart data={DBT_TREND} seriesA={bi('Released', 'வழங்கியது')} unit=" Cr" height={170} />
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel>
          <PanelHead
            icon="engineering"
            title={bi('MGNREGS person-days', 'நூறு நாள் வேலை — ஆள் நாட்கள்')}
            note={bi('Against block labour budget', 'ஒன்றிய உழைப்பு நிதி இலக்கை ஒப்பிட')}
          />
          <BarList data={MGNREGS} />
        </Panel>

        <Panel>
          <PanelHead
            icon="report"
            title={bi('Exception flags', 'விதிவிலக்கு எச்சரிக்கை')}
            note={bi('Ghost beneficiary and seeding checks', 'போலி பயனாளி மற்றும் இணைப்பு சோதனை')}
          />
          <DataTable
            columns={flagColumns}
            rows={FLAGS}
            rowKey={(row) => row.id}
            searchable={false}
            dense
            exportName="krishnagiri-dbt-exceptions"
            onRowClick={(row) =>
              setDrill({
                title: t(row.issue),
                ref: row.id.toUpperCase(),
                tone: row.tone,
                status: num(row.count),
                facts: [
                  { label: bi('Scheme', 'திட்டம்'), value: t(row.scheme) },
                  { label: bi('Block', 'ஒன்றியம்'), value: t(row.block) },
                  { label: bi('Records', 'பதிவுகள்'), value: num(row.count) },
                  { label: bi('Value at risk', 'ஆபத்தில் உள்ள தொகை'), value: inr(row.count * 0.001) },
                ],
                officer: { name: 'S. Manivannan', designation: DESIG.bdo, phone: '+914344234567' },
                audit: { updated: '23 Oct 22:10', by: 'DBT exception engine', source: SRC.dbt },
                actions: [{ label: bi('Order field verification', 'கள சரிபார்ப்பு உத்தரவு'), icon: 'how_to_reg', variant: 'danger' }],
              })
            }
          />
        </Panel>
      </div>

      <Panel>
        <PanelHead
          icon="home_work"
          title={bi('Housing progress', 'வீட்டுவசதி முன்னேற்றம்')}
          note={bi('PMAY-G and CM Solar Powered Housing', 'பிரதமர் ஊரக வீடு மற்றும் சூரிய சக்தி வீடு')}
        />
        <BarList
          data={[
            { label: bi('Sanctioned', 'ஒப்புதல்'), value: 4820, color: SERIES[0] },
            { label: bi('Foundation', 'அடித்தளம்'), value: 4610, color: SERIES[0] },
            { label: bi('Roof level', 'கூரை நிலை'), value: 3910, color: SERIES[1] },
            { label: bi('Completed', 'நிறைவு'), value: 2984, color: SERIES[2] },
          ]}
          max={4820}
        />
      </Panel>

      <DrillDrawer drill={drill} onClose={() => setDrill(null)} />
    </div>
  )
}
