import { useState } from 'react'
import { bi, num, pct, useI18n, type Bi } from '../i18n'
import { ui } from '../i18n/ui'
import { PageHead } from '../components/ui/PageHead'
import { Panel, PanelHead, Segmented, Stat, StatGrid, Status } from '../components/ui/Primitives'
import { Donut, Heatmap } from '../components/ui/Charts'
import { DataTable, type Column } from '../components/ui/DataTable'
import { DrillDrawer, type Drill } from '../components/ui/Drawer'
import { SRC } from '../data/common'
import { PETITIONS, type Petition } from '../data/petitions'

const CHANNELS = [
  { id: 'cmcell', label: bi('CM Cell', 'முதல்வர் தனிப்பிரிவு'), received: 1842, disposed: 1701, pending: 141, over30: 38 },
  { id: 'ungaludan', label: bi('Ungaludan Stalin', 'உங்களுடன் ஸ்டாலின்'), received: 2410, disposed: 2286, pending: 124, over30: 21 },
  { id: 'makkaludan', label: bi('Makkaludan Mudhalvar', 'மக்களுடன் முதல்வர்'), received: 1268, disposed: 1174, pending: 94, over30: 16 },
  { id: 'cpgrams', label: bi('CPGRAMS', 'மத்திய மனு தளம்'), received: 604, disposed: 548, pending: 56, over30: 9 },
  { id: 'gday', label: bi('Grievance Day', 'மனுநீதி நாள்'), received: 1996, disposed: 1854, pending: 142, over30: 12 },
]

/**
 * Pending petitions by department and age bucket. The grid totals 557, which is
 * the pending figure the channel table adds up to, and the last two columns
 * total 96 — the same "beyond 30 days" count. Change one, change the other.
 */
const DEPT_AGE: { label: Bi; values: number[] }[] = [
  { label: bi('Revenue', 'வருவாய்'), values: [92, 48, 26, 17, 9] },
  { label: bi('Rural development', 'ஊரக வளர்ச்சி'), values: [66, 34, 18, 14, 6] },
  { label: bi('TWAD / water', 'குடிநீர் வாரியம்'), values: [40, 22, 12, 12, 8] },
  { label: bi('Social welfare', 'சமூக நலம்'), values: [26, 14, 7, 7, 4] },
  { label: bi('Electricity', 'மின்சாரம்'), values: [17, 9, 4, 4, 2] },
  { label: bi('Police', 'காவல்'), values: [9, 5, 2, 5, 3] },
  { label: bi('Health', 'சுகாதாரம்'), values: [6, 3, 1, 3, 2] },
]

/** Short day suffix, so a count reads the same in both languages. */
const DAY_SHORT = bi('d', 'நா')

const AGE_COLS: Bi[] = [
  bi('0–7 d', '0–7 நா'),
  bi('8–15 d', '8–15 நா'),
  bi('16–30 d', '16–30 நா'),
  bi('31–60 d', '31–60 நா'),
  bi('60+ d', '60+ நா'),
]


export function GrievancesPage() {
  const { t } = useI18n()
  const [drill, setDrill] = useState<Drill | null>(null)
  const [view, setView] = useState<'age' | 'channel'>('age')

  const received = CHANNELS.reduce((sum, c) => sum + c.received, 0)
  const disposed = CHANNELS.reduce((sum, c) => sum + c.disposed, 0)
  const pending = CHANNELS.reduce((sum, c) => sum + c.pending, 0)
  const over30 = CHANNELS.reduce((sum, c) => sum + c.over30, 0)

  const channelColumns: Column<(typeof CHANNELS)[number]>[] = [
    { key: 'ch', head: bi('How it came in', 'எப்படி வந்தது'), text: (row) => t(row.label) },
    { key: 'rec', head: bi('Received', 'வந்தவை'), align: 'right', text: (row) => num(row.received) },
    { key: 'dis', head: bi('Solved', 'தீர்க்கப்பட்டவை'), align: 'right', text: (row) => num(row.disposed) },
    { key: 'pen', head: bi('Still open', 'நிலுவையில்'), align: 'right', text: (row) => num(row.pending) },
    {
      key: 'over',
      head: bi('Over 30 days', '30 நாளுக்கு மேல்'),
      align: 'right',
      text: (row) => num(row.over30),
      render: (row) => (
        <Status tone={row.over30 > 30 ? 'critical' : row.over30 > 15 ? 'serious' : 'good'} label={num(row.over30)} />
      ),
    },
    {
      key: 'rate',
      head: bi('% solved', '% தீர்க்கப்பட்டது'),
      align: 'right',
      text: (row) => pct((row.disposed / row.received) * 100),
      minor: true,
    },
  ]

  const petitionColumns: Column<Petition>[] = [
    {
      key: 'subject',
      head: bi('Complaint', 'புகார்'),
      text: (row) => t(row.subject),
      render: (row) => (
        <span className="flex flex-col">
          <span className="font-label-md text-label-md font-bold">{t(row.subject)}</span>
          <span className="font-mono font-label-sm text-label-sm text-on-surface-variant">
            {row.id}
          </span>
        </span>
      ),
    },
    { key: 'pet', head: bi('Who complained', 'புகார் அளித்தவர்'), text: (row) => `${row.petitioner} · ${row.mobile}` },
    { key: 'village', head: bi('Village', 'கிராமம்'), text: (row) => t(row.village), minor: true },
    { key: 'dept', head: bi('Department', 'துறை'), text: (row) => t(row.dept) },
    {
      key: 'age',
      head: bi('Waiting', 'காத்திருப்பு'),
      align: 'right',
      text: (row) => `${row.age} ${t(DAY_SHORT)}`,
      render: (row) => (
        <Status
          tone={row.age > 60 ? 'critical' : row.age > 45 ? 'serious' : 'warning'}
          label={`${row.age} ${t(DAY_SHORT)}`}
        />
      ),
    },
    { key: 'officer', head: bi('Who has it', 'யாரிடம் உள்ளது'), text: (row) => row.officer },
  ]

  return (
    <div className="flex flex-col gap-4">
      <PageHead
        title={bi('Public complaints', 'பொது மக்கள் புகார்கள்')}
        note={bi('Every way a complaint reaches us, and how fast we close it', 'புகார் வரும் எல்லா வழிகளும், எவ்வளவு விரைவில் முடிக்கிறோம் என்பதும்')}
        icon="mark_email_unread"
      />

      <StatGrid>
        <Stat label={bi('Received this year', 'இந்த ஆண்டு வந்தவை')} value={num(received)} />
        <Stat label={bi('Solved', 'தீர்க்கப்பட்டவை')} value={num(disposed)} delta={pct((disposed / received) * 100)} deltaTone="good" meter={(disposed / received) * 100} meterTone="good" />
        <Stat label={bi('Still open', 'இன்னும் நிலுவையில்')} value={num(pending)} deltaTone="bad" />
        <Stat label={bi('Waiting over 30 days', '30 நாளுக்கு மேல் காத்திருப்பு')} value={num(over30)} delta={t(bi('Collector review', 'ஆட்சியர் ஆய்வு'))} deltaTone="bad" />
        <Stat label={bi('Average time to solve', 'தீர்க்க ஆகும் சராசரி நாட்கள்')} value="11.4" unit={t(bi('days', 'நாட்கள்'))} delta="-2.1" deltaTone="good" />
      </StatGrid>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <PanelHead
            icon="grid_view"
            title={bi('How long people have waited', 'மக்கள் எவ்வளவு நாள் காத்திருக்கிறார்கள்')}
            note={bi('Open complaints, by department and waiting time', 'நிலுவைப் புகார்கள், துறை மற்றும் காத்திருப்பு நேரம் வாரியாக')}
            actions={
              <Segmented
                value={view}
                onChange={setView}
                options={[
                  { value: 'age', label: bi('Waiting time', 'காத்திருப்பு') },
                  { value: 'channel', label: bi('How it came in', 'எப்படி வந்தது') },
                ]}
              />
            }
          />
          {view === 'age' ? (
            <Heatmap
              rows={DEPT_AGE}
              columns={AGE_COLS}
              legend={bi('Fewer → more still open', 'குறைவு → அதிக நிலுவை')}
            />
          ) : (
            <DataTable
              columns={channelColumns}
              rows={CHANNELS}
              rowKey={(row) => row.id}
              searchable={false}
              exportName="krishnagiri-grievance-channels"
            />
          )}
        </Panel>

        <Panel>
          <PanelHead
            icon="donut_small"
            title={bi('Still open, by how it came in', 'நிலுவை — வந்த வழி வாரியாக')}
            note={bi('Live count', 'நேரலை எண்ணிக்கை')}
          />
          <Donut
            centerValue={num(pending)}
            centerLabel={bi('still open', 'நிலுவை')}
            data={[
              { label: bi('Grievance Day', 'மனுநீதி நாள்'), value: 142 },
              { label: bi('CM Cell', 'முதல்வர் பிரிவு'), value: 141 },
              { label: bi('Others', 'பிற'), value: 274 },
            ]}
          />
          <div className="mt-4 rounded bg-surface-container-low p-2.5">
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              {t(bi('Today at Grievance Day', 'இன்று மனுநீதி நாளில்'))}
            </p>
            <p className="font-headline-sm text-headline-sm font-bold text-on-surface">
              380 {t(bi('people waiting', 'பேர் காத்திருக்கிறார்கள்'))}
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {t(bi('Officers: DRO, PA (General), all 7 Tahsildars', 'அலுவலர்கள்: மா.வ.அ, தனி உதவியாளர், 7 வட்டாட்சியர்கள்'))}
            </p>
          </div>
        </Panel>
      </div>

      <Panel>
        <PanelHead
          icon="assignment_late"
          title={bi('Waiting the longest', 'மிக நீண்ட நாள் காத்திருப்பவை')}
          note={bi('Open a row for their phone number and the officer holding it', 'அவர்களின் தொலைபேசி எண் மற்றும் அலுவலர் விவரத்திற்கு வரிசையைத் திறக்கவும்')}
        />
        <DataTable
          columns={petitionColumns}
          rows={PETITIONS}
          rowKey={(row) => row.id}
          exportName="krishnagiri-oldest-petitions"
          onRowClick={(row) =>
            setDrill({
              title: t(row.subject),
              ref: row.id,
              tone: row.age > 60 ? 'critical' : 'serious',
              status: `${t(bi('Waiting', 'காத்திருப்பு'))} ${row.age} ${t(ui.days)}`,
              facts: [
                { label: bi('Who complained', 'புகார் அளித்தவர்'), value: row.petitioner },
                { label: bi('Mobile', 'கைபேசி'), value: row.mobile },
                { label: bi('Village', 'கிராமம்'), value: t(row.village) },
                { label: bi('Department', 'துறை'), value: t(row.dept) },
                { label: bi('How it came in', 'எப்படி வந்தது'), value: t(row.channel) },
                { label: bi('Waiting', 'காத்திருப்பு'), value: `${row.age} ${t(ui.days)}` },
              ],
              officer: { name: row.officer, designation: row.designation, phone: row.phone },
              audit: { updated: '24 Oct 07:05', by: 'Grievance monitoring cell', source: SRC.cmcell },
              actions: [
                { label: bi('Set a deadline', 'காலக்கெடு நிர்ணயி'), icon: 'schedule', variant: 'accent' },
                { label: bi('Escalate', 'மேல்முறையீடு'), icon: 'trending_up' },
              ],
            })
          }
        />
      </Panel>

      <DrillDrawer drill={drill} onClose={() => setDrill(null)} />
    </div>
  )
}
