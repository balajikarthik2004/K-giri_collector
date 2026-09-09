import { useState } from 'react'
import { bi, num, pct, useI18n, type Bi } from '../i18n'
import { PageHead } from '../components/ui/PageHead'
import { Panel, PanelHead, Segmented, Stat, StatGrid, Status } from '../components/ui/Primitives'
import { BarList, Donut, SERIES } from '../components/ui/Charts'
import { DataTable, type Column } from '../components/ui/DataTable'
import { DrillDrawer, type Drill } from '../components/ui/Drawer'
import { DESIG, SRC } from '../data/common'

type WaterRow = {
  id: string
  area: Bi
  body: Bi
  lpcd: number
  tankers: number
  source: Bi
  tone: 'good' | 'warning' | 'serious' | 'critical'
}

const WATER: WaterRow[] = [
  { id: 'w1', area: bi('Hosur Corporation', 'ஓசூர் மாநகராட்சி'), body: bi('Corporation', 'மாநகராட்சி'), lpcd: 118, tankers: 12, source: bi('Kelavarapalli', 'கெலவரப்பள்ளி'), tone: 'good' },
  { id: 'w2', area: bi('Krishnagiri Municipality', 'கிருஷ்ணகிரி நகராட்சி'), body: bi('Municipality', 'நகராட்சி'), lpcd: 96, tankers: 8, source: bi('KRP dam', 'கே.ஆர்.பி அணை'), tone: 'good' },
  { id: 'w3', area: bi('Bargur town panchayat', 'பர்கூர் பேரூராட்சி'), body: bi('Town panchayat', 'பேரூராட்சி'), lpcd: 68, tankers: 14, source: bi('Borewells', 'ஆழ்துளை கிணறு'), tone: 'serious' },
  { id: 'w4', area: bi('Uthangarai town panchayat', 'ஊத்தங்கரை பேரூராட்சி'), body: bi('Town panchayat', 'பேரூராட்சி'), lpcd: 54, tankers: 22, source: bi('Borewells', 'ஆழ்துளை கிணறு'), tone: 'critical' },
  { id: 'w5', area: bi('Thally rural cluster', 'தளி ஊரக கொத்து'), body: bi('Panchayat union', 'ஊராட்சி ஒன்றியம்'), lpcd: 72, tankers: 9, source: bi('CWSS', 'கூட்டு குடிநீர் திட்டம்'), tone: 'warning' },
  { id: 'w6', area: bi('Shoolagiri rural cluster', 'சூளகிரி ஊரக கொத்து'), body: bi('Panchayat union', 'ஊராட்சி ஒன்றியம்'), lpcd: 84, tankers: 4, source: bi('CWSS', 'கூட்டு குடிநீர் திட்டம்'), tone: 'good' },
]

type Work = {
  id: string
  work: Bi
  agency: Bi
  costCr: number
  progress: number
  photos: number
  tone: 'good' | 'warning' | 'serious' | 'critical'
}

const WORKS: Work[] = [
  { id: 'wk1', work: bi('Hosur UGD Phase II', 'ஓசூர் நிலத்தடி கழிவுநீர் கட்டம் II'), agency: bi('TWAD', 'குடிநீர் வாரியம்'), costCr: 184.2, progress: 62, photos: 48, tone: 'warning' },
  { id: 'wk2', work: bi('Krishnagiri bus stand upgrade', 'கிருஷ்ணகிரி பேருந்து நிலைய மேம்பாடு'), agency: bi('Municipality', 'நகராட்சி'), costCr: 22.4, progress: 88, photos: 26, tone: 'good' },
  { id: 'wk3', work: bi('Rural road package — Bargur', 'ஊரக சாலைத் தொகுப்பு — பர்கூர்'), agency: bi('Rural development', 'ஊரக வளர்ச்சி'), costCr: 41.6, progress: 34, photos: 18, tone: 'serious' },
  { id: 'wk4', work: bi('Solid waste plant — Shoolagiri', 'திடக்கழிவு ஆலை — சூளகிரி'), agency: bi('Panchayat union', 'ஊராட்சி ஒன்றியம்'), costCr: 8.9, progress: 19, photos: 6, tone: 'critical' },
  { id: 'wk5', work: bi('Storm water drain — Hosur ward 12–21', 'மழைநீர் வடிகால் — ஓசூர் வார்டு 12–21'), agency: bi('Corporation', 'மாநகராட்சி'), costCr: 36.8, progress: 71, photos: 34, tone: 'good' },
]

const TAX = [
  { label: bi('Hosur Corporation', 'ஓசூர் மாநகராட்சி'), value: 78, note: '₹94.2 Cr' },
  { label: bi('Krishnagiri Municipality', 'கிருஷ்ணகிரி நகராட்சி'), value: 71, note: '₹18.6 Cr' },
  { label: bi('Town panchayats (7)', 'பேரூராட்சிகள் (7)'), value: 64, note: '₹11.2 Cr' },
  { label: bi('Village panchayats', 'ஊராட்சிகள்'), value: 52, note: '₹8.4 Cr' },
]

export function InfrastructurePage() {
  const { t } = useI18n()
  const [drill, setDrill] = useState<Drill | null>(null)
  const [tab, setTab] = useState<'water' | 'works'>('water')

  const waterColumns: Column<WaterRow>[] = [
    { key: 'area', head: bi('Area', 'பகுதி'), text: (row) => t(row.area) },
    { key: 'body', head: bi('Body', 'அமைப்பு'), text: (row) => t(row.body), minor: true },
    {
      key: 'lpcd',
      head: bi('Supply (LPCD)', 'விநியோகம் (லி/நபர்/நாள்)'),
      align: 'right',
      text: (row) => num(row.lpcd),
      render: (row) => <Status tone={row.tone} label={num(row.lpcd)} />,
    },
    { key: 'tankers', head: bi('Tankers/day', 'தொட்டி லாரி/நாள்'), align: 'right', text: (row) => num(row.tankers) },
    { key: 'source', head: bi('Source', 'ஆதாரம்'), text: (row) => t(row.source), minor: true },
  ]

  const workColumns: Column<Work>[] = [
    { key: 'work', head: bi('Work', 'பணி'), text: (row) => t(row.work) },
    { key: 'agency', head: bi('Agency', 'நிறுவனம்'), text: (row) => t(row.agency), minor: true },
    { key: 'cost', head: bi('Cost', 'மதிப்பு'), align: 'right', text: (row) => `₹${num(row.costCr, 1)} Cr` },
    {
      key: 'prog',
      head: bi('Progress', 'முன்னேற்றம்'),
      align: 'right',
      text: (row) => pct(row.progress, 0),
      render: (row) => (
        <span className="flex flex-col items-end gap-1">
          <span className="font-label-sm text-label-sm font-bold tabular-nums">{row.progress}%</span>
          <span className="block h-1.5 w-20 overflow-hidden rounded-full bg-surface-container">
            <span
              className="block h-full rounded-full bg-viz-1"
              style={{ width: `${row.progress}%` }}
            />
          </span>
        </span>
      ),
    },
    {
      key: 'photos',
      head: bi('Photo evidence', 'புகைப்பட சான்று'),
      align: 'right',
      text: (row) => num(row.photos),
      minor: true,
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <PageHead
        title={bi('Water & infrastructure', 'குடிநீர் & உள்கட்டமைப்பு')}
        note={bi('Urban and rural supply, works, sanitation, property tax', 'நகர்ப்புற மற்றும் ஊரக விநியோகம், பணிகள், தூய்மை, சொத்து வரி')}
        icon="water_drop"
      />

      <StatGrid>
        <Stat label={bi('Habitations short of supply', 'விநியோகக் குறைவு குடியிருப்பு')} value="46" delta={t(bi('2 critical', '2 தீவிரம்'))} deltaTone="bad" />
        <Stat label={bi('Tankers deployed', 'தொட்டி லாரி')} value="69" unit={t(bi('per day', 'நாளொன்றுக்கு'))} />
        <Stat label={bi('Streetlight failures', 'தெரு விளக்கு பழுது')} value={num(1284)} delta={t(bi('86% closed in 48 h', '48 மணியில் 86% சரி'))} deltaTone="good" meter={86} meterTone="good" />
        <Stat label={bi('Property tax collection', 'சொத்து வரி வசூல்')} value="68.4%" delta="₹132.4 Cr" deltaTone="neutral" meter={68.4} meterTone="warning" />
        <Stat label={bi('Building approvals pending', 'கட்டட அனுமதி நிலுவை')} value="212" delta={t(bi('38 beyond SLA', '38 கால வரம்பு மீறல்'))} deltaTone="bad" />
      </StatGrid>

      <Panel>
        <PanelHead
          icon="plumbing"
          title={bi('Supply and works', 'விநியோகம் மற்றும் பணிகள்')}
          note={bi('Ward and habitation level status', 'வார்டு மற்றும் குடியிருப்பு நிலை')}
          actions={
            <Segmented
              value={tab}
              onChange={setTab}
              options={[
                { value: 'water', label: bi('Water supply', 'குடிநீர்') },
                { value: 'works', label: bi('Works', 'பணிகள்') },
              ]}
            />
          }
        />
        {tab === 'water' ? (
          <DataTable
            columns={waterColumns}
            rows={WATER}
            rowKey={(row) => row.id}
            exportName="krishnagiri-water-supply"
            onRowClick={(row) =>
              setDrill({
                title: t(row.area),
                ref: row.id.toUpperCase(),
                tone: row.tone,
                status: `${row.lpcd} LPCD`,
                facts: [
                  { label: bi('Local body', 'உள்ளாட்சி'), value: t(row.body) },
                  { label: bi('Supply', 'விநியோகம்'), value: `${row.lpcd} LPCD` },
                  { label: bi('Tankers/day', 'தொட்டி லாரி'), value: num(row.tankers) },
                  { label: bi('Source', 'ஆதாரம்'), value: t(row.source) },
                  { label: bi('Open complaints', 'நிலுவை புகார்'), value: '28' },
                  { label: bi('Next indent', 'அடுத்த கோரிக்கை'), value: '25 Oct' },
                ],
                officer: { name: 'N. Saravanan', designation: DESIG.ee, phone: '+914344251200' },
                audit: { updated: '24 Oct 07:15', by: 'TWAD division', source: SRC.pwd },
                actions: [{ label: bi('Sanction tankers', 'தொட்டி லாரி ஒப்புதல்'), icon: 'local_shipping', variant: 'accent' }],
              })
            }
          />
        ) : (
          <DataTable
            columns={workColumns}
            rows={WORKS}
            rowKey={(row) => row.id}
            exportName="krishnagiri-works"
            onRowClick={(row) =>
              setDrill({
                title: t(row.work),
                ref: row.id.toUpperCase(),
                tone: row.tone,
                status: `${row.progress}%`,
                facts: [
                  { label: bi('Agency', 'நிறுவனம்'), value: t(row.agency) },
                  { label: bi('Sanctioned cost', 'ஒப்புதல் மதிப்பு'), value: `₹${num(row.costCr, 1)} Cr` },
                  { label: bi('Physical progress', 'இயற்பியல் முன்னேற்றம்'), value: `${row.progress}%` },
                  { label: bi('Photo evidence', 'புகைப்பட சான்று'), value: `${row.photos} uploads` },
                  { label: bi('Target date', 'இலக்கு தேதி'), value: '31 Mar 2025' },
                  { label: bi('Last inspection', 'கடைசி ஆய்வு'), value: '18 Oct 2024' },
                ],
                officer: { name: 'N. Saravanan', designation: DESIG.ee, phone: '+914344251200' },
                audit: { updated: '22 Oct 15:10', by: 'Works monitoring cell', source: SRC.pwd },
                actions: [{ label: bi('Site inspection', 'கள ஆய்வு'), icon: 'photo_camera', variant: 'primary' }],
              })
            }
          />
        )}
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel>
          <PanelHead
            icon="receipt_long"
            title={bi('Property tax collection', 'சொத்து வரி வசூல்')}
            note={bi('Percentage of current demand', 'நடப்பு கோரிக்கையின் சதவீதம்')}
          />
          <BarList data={TAX} unit="%" max={100} />
        </Panel>

        <Panel>
          <PanelHead
            icon="delete"
            title={bi('Solid waste management', 'திடக்கழிவு மேலாண்மை')}
            note={bi('Daily tonnage handling', 'நாளொன்றுக்கு டன்')}
          />
          <Donut
            centerValue="412 t"
            centerLabel={bi('per day', 'நாளொன்றுக்கு')}
            data={[
              { label: bi('Processed', 'பதப்படுத்தப்பட்டது'), value: 268, color: SERIES[2] },
              { label: bi('Landfill', 'நிலம் நிரப்பு'), value: 106, color: SERIES[1] },
              { label: bi('Unattended', 'கையாளப்படாதது'), value: 38, color: SERIES[3] },
            ]}
          />
          <p className="mt-3 font-body-sm text-body-sm text-on-surface-variant">
            {t(bi('Source segregation 71% · 4 micro-compost centres pending commissioning', 'மூலப் பிரிப்பு 71% · 4 நுண் உரம் மையம் தொடங்கப்படவில்லை'))}
          </p>
        </Panel>
      </div>

      <DrillDrawer drill={drill} onClose={() => setDrill(null)} />
    </div>
  )
}
