import { useState } from 'react'
import { bi, num, pct, useI18n, type Bi } from '../i18n'
import { PageHead } from '../components/ui/PageHead'
import { Panel, PanelHead, Stat, StatGrid, Status } from '../components/ui/Primitives'
import { BarList, Donut, SERIES } from '../components/ui/Charts'
import { DataTable, type Column } from '../components/ui/DataTable'
import { DrillDrawer, type Drill } from '../components/ui/Drawer'
import { DESIG, SRC } from '../data/common'

type Ac = {
  id: string
  name: Bi
  electors: number
  additions: number
  deletions: number
  epicPending: number
  stations: number
  gaps: number
  tone: 'good' | 'warning' | 'serious' | 'critical'
}

const ACS: Ac[] = [
  { id: 'ac1', name: bi('56 – Uthangarai (SC)', '56 – ஊத்தங்கரை (த.ச)'), electors: 262400, additions: 4180, deletions: 2140, epicPending: 386, stations: 312, gaps: 14, tone: 'warning' },
  { id: 'ac2', name: bi('57 – Bargur', '57 – பர்கூர்'), electors: 248600, additions: 3860, deletions: 1980, epicPending: 294, stations: 298, gaps: 9, tone: 'good' },
  { id: 'ac3', name: bi('58 – Krishnagiri', '58 – கிருஷ்ணகிரி'), electors: 284100, additions: 5240, deletions: 2410, epicPending: 512, stations: 336, gaps: 21, tone: 'serious' },
  { id: 'ac4', name: bi('59 – Veppanahalli', '59 – வேப்பனஹள்ளி'), electors: 236800, additions: 3420, deletions: 1760, epicPending: 248, stations: 284, gaps: 8, tone: 'good' },
  { id: 'ac5', name: bi('60 – Hosur', '60 – ஓசூர்'), electors: 312400, additions: 6840, deletions: 2960, epicPending: 684, stations: 364, gaps: 28, tone: 'critical' },
  { id: 'ac6', name: bi('61 – Thalli', '61 – தளி'), electors: 224200, additions: 3140, deletions: 1620, epicPending: 216, stations: 268, gaps: 6, tone: 'good' },
]

const GAPS = [
  { label: bi('Ramp missing', 'சாய்வுப் பாதை இல்லை'), value: 34 },
  { label: bi('Drinking water', 'குடிநீர்'), value: 21 },
  { label: bi('Toilet unusable', 'கழிப்பறை பயன்படுத்த முடியாது'), value: 18 },
  { label: bi('Power connection', 'மின் இணைப்பு'), value: 9 },
  { label: bi('Building unsafe', 'கட்டடம் பாதுகாப்பற்றது'), value: 4 },
]

export function ElectionsPage() {
  const { t } = useI18n()
  const [drill, setDrill] = useState<Drill | null>(null)

  const electors = ACS.reduce((sum, row) => sum + row.electors, 0)
  const epic = ACS.reduce((sum, row) => sum + row.epicPending, 0)
  const stations = ACS.reduce((sum, row) => sum + row.stations, 0)
  const gaps = ACS.reduce((sum, row) => sum + row.gaps, 0)

  const columns: Column<Ac>[] = [
    { key: 'ac', head: bi('Assembly constituency', 'சட்டமன்ற தொகுதி'), text: (row) => t(row.name) },
    { key: 'electors', head: bi('Electors', 'வாக்காளர்'), align: 'right', text: (row) => num(row.electors) },
    { key: 'add', head: bi('Form 6 additions', 'படிவம் 6 சேர்க்கை'), align: 'right', text: (row) => num(row.additions) },
    { key: 'del', head: bi('Form 7 deletions', 'படிவம் 7 நீக்கம்'), align: 'right', text: (row) => num(row.deletions), minor: true },
    {
      key: 'epic',
      head: bi('EPIC pending', 'அடையாள அட்டை நிலுவை'),
      align: 'right',
      text: (row) => num(row.epicPending),
      render: (row) => <Status tone={row.tone} label={num(row.epicPending)} />,
    },
    {
      key: 'gaps',
      head: bi('Station gaps', 'வாக்குச்சாவடி குறை'),
      align: 'right',
      text: (row) => `${row.gaps} / ${row.stations}`,
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <PageHead
        title={bi('Electoral roll & civic readiness', 'வாக்காளர் பட்டியல் & குடிமைத் தயார்நிலை')}
        note={bi('Special summary revision, EPIC pendency, polling infrastructure', 'சிறப்பு சுருக்கத் திருத்தம், அடையாள அட்டை நிலுவை, வாக்குச்சாவடி வசதி')}
        icon="how_to_vote"
      />

      <StatGrid>
        <Stat label={bi('Total electors', 'மொத்த வாக்காளர்')} value={num(electors)} footnote={bi('6 assembly constituencies', '6 சட்டமன்ற தொகுதிகள்')} />
        <Stat label={bi('SSR claims received', 'திருத்தக் கோரிக்கை')} value={num(26680)} delta={t(bi('Form 6 + 7', 'படிவம் 6 + 7'))} deltaTone="neutral" />
        <Stat label={bi('EPIC pending', 'அடையாள அட்டை நிலுவை')} value={num(epic)} delta={t(bi('printing queue', 'அச்சு வரிசை'))} deltaTone="bad" />
        <Stat label={bi('Polling stations', 'வாக்குச்சாவடி')} value={num(stations)} />
        <Stat label={bi('Assured minimum facility gaps', 'குறைந்தபட்ச வசதி குறை')} value={num(gaps)} delta={pct((gaps / stations) * 100, 1)} deltaTone="bad" meter={100 - (gaps / stations) * 100} meterTone="warning" />
      </StatGrid>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <PanelHead
            icon="ballot"
            title={bi('Constituency-wise roll status', 'தொகுதிவாரி பட்டியல் நிலை')}
            note={bi('Special summary revision in progress', 'சிறப்பு சுருக்கத் திருத்தம் நடைபெறுகிறது')}
          />
          <DataTable
            columns={columns}
            rows={ACS}
            rowKey={(row) => row.id}
            exportName="krishnagiri-electoral-roll"
            onRowClick={(row) =>
              setDrill({
                title: t(row.name),
                ref: row.id.toUpperCase(),
                tone: row.tone,
                status: `${num(row.epicPending)} EPIC`,
                facts: [
                  { label: bi('Electors', 'வாக்காளர்'), value: num(row.electors) },
                  { label: bi('Form 6 additions', 'படிவம் 6'), value: num(row.additions) },
                  { label: bi('Form 7 deletions', 'படிவம் 7'), value: num(row.deletions) },
                  { label: bi('EPIC pending', 'அடையாள அட்டை'), value: num(row.epicPending) },
                  { label: bi('Polling stations', 'வாக்குச்சாவடி'), value: num(row.stations) },
                  { label: bi('Facility gaps', 'வசதி குறை'), value: num(row.gaps) },
                ],
                officer: { name: 'K. Sekar', designation: DESIG.tahsildar, phone: '+914343232102' },
                audit: { updated: '23 Oct 20:00', by: 'ERO office upload', source: SRC.eroll },
                actions: [{ label: bi('Order BLO drive', 'வா.நி.அ இயக்கம்'), icon: 'campaign', variant: 'accent' }],
              })
            }
          />
        </Panel>

        <Panel>
          <PanelHead
            icon="construction"
            title={bi('Polling station gaps', 'வாக்குச்சாவடி குறைபாடு')}
            note={bi('Assured minimum facilities', 'உறுதி செய்யப்பட்ட குறைந்தபட்ச வசதிகள்')}
          />
          <BarList data={GAPS} />
          <div className="mt-4">
            <Donut
              size={116}
              centerValue={num(26680)}
              centerLabel={bi('SSR claims', 'திருத்தக் கோரிக்கை')}
              data={[
                { label: bi('Disposed', 'தீர்வு'), value: 21440, color: SERIES[2] },
                { label: bi('Under verification', 'சரிபார்ப்பில்'), value: 3860, color: SERIES[0] },
                { label: bi('Pending', 'நிலுவை'), value: 1380, color: SERIES[1] },
              ]}
            />
          </div>
        </Panel>
      </div>

      <DrillDrawer drill={drill} onClose={() => setDrill(null)} />
    </div>
  )
}
