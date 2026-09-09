import { useState } from 'react'
import { bi, num, pct, useI18n, type Bi } from '../i18n'
import { PageHead } from '../components/ui/PageHead'
import { Panel, PanelHead, Segmented, Stat, StatGrid, Status } from '../components/ui/Primitives'
import { Donut, Heatmap } from '../components/ui/Charts'
import { DataTable, type Column } from '../components/ui/DataTable'
import { DrillDrawer, type Drill } from '../components/ui/Drawer'
import { DESIG, SRC } from '../data/common'

const CHANNELS = [
  { id: 'cmcell', label: bi('CM Cell', 'முதல்வர் தனிப்பிரிவு'), received: 1842, disposed: 1701, pending: 141, over30: 38 },
  { id: 'ungaludan', label: bi('Ungaludan Stalin', 'உங்களுடன் ஸ்டாலின்'), received: 2410, disposed: 2286, pending: 124, over30: 21 },
  { id: 'makkaludan', label: bi('Makkaludan Mudhalvar', 'மக்களுடன் முதல்வர்'), received: 1268, disposed: 1174, pending: 94, over30: 16 },
  { id: 'cpgrams', label: bi('CPGRAMS', 'மத்திய மனு தளம்'), received: 604, disposed: 548, pending: 56, over30: 9 },
  { id: 'gday', label: bi('Grievance Day', 'மனுநீதி நாள்'), received: 1996, disposed: 1854, pending: 142, over30: 12 },
]

const DEPT_AGE: { label: Bi; values: number[] }[] = [
  { label: bi('Revenue', 'வருவாய்'), values: [86, 54, 31, 18, 11] },
  { label: bi('Rural development', 'ஊரக வளர்ச்சி'), values: [72, 41, 22, 9, 6] },
  { label: bi('TWAD / water', 'குடிநீர் வாரியம்'), values: [64, 38, 26, 14, 8] },
  { label: bi('Social welfare', 'சமூக நலம்'), values: [48, 26, 12, 7, 3] },
  { label: bi('Electricity', 'மின்சாரம்'), values: [41, 19, 9, 4, 2] },
  { label: bi('Police', 'காவல்'), values: [33, 17, 8, 5, 4] },
  { label: bi('Health', 'சுகாதாரம்'), values: [22, 11, 5, 2, 1] },
]

const AGE_COLS: Bi[] = [
  bi('0–7 d', '0–7 நா'),
  bi('8–15 d', '8–15 நா'),
  bi('16–30 d', '16–30 நா'),
  bi('31–60 d', '31–60 நா'),
  bi('60+ d', '60+ நா'),
]

type Petition = {
  id: string
  subject: Bi
  petitioner: string
  mobile: string
  village: Bi
  dept: Bi
  channel: Bi
  age: number
  officer: string
  designation: Bi
  phone: string
}

const PETITIONS: Petition[] = [
  { id: 'CM/KRI/88214', subject: bi('Drinking water shortage 12 days', '12 நாட்களாக குடிநீர் தட்டுப்பாடு'), petitioner: 'R. Selvarani', mobile: '94xxx 21870', village: bi('Berigai', 'பேரிகை'), dept: bi('TWAD', 'குடிநீர் வாரியம்'), channel: bi('CM Cell', 'முதல்வர் தனிப்பிரிவு'), age: 68, officer: 'S. Manivannan', designation: DESIG.bdo, phone: '+914344234567' },
  { id: 'US/KRI/40122', subject: bi('Patta transfer not effected after order', 'உத்தரவுக்குப் பின்னும் பட்டா மாற்றம் இல்லை'), petitioner: 'K. Munusamy', mobile: '90xxx 44120', village: bi('Kelamangalam', 'கேளமங்கலம்'), dept: bi('Revenue', 'வருவாய்'), channel: bi('Ungaludan Stalin', 'உங்களுடன் ஸ்டாலின்'), age: 54, officer: 'R. Vinoth', designation: DESIG.tahsildar, phone: '+914347222104' },
  { id: 'PG/KRI/7781', subject: bi('Old age pension arrears 3 months', 'முதியோர் ஓய்வூதிய நிலுவை 3 மாதம்'), petitioner: 'A. Lakshmi', mobile: '99xxx 10233', village: bi('Mathur', 'மாத்தூர்'), dept: bi('Social welfare', 'சமூக நலம்'), channel: bi('CPGRAMS', 'மத்திய மனு தளம்'), age: 47, officer: 'D. Priya', designation: DESIG.dd, phone: '+914343240011' },
  { id: 'MM/KRI/5510', subject: bi('Street light not repaired', 'தெரு விளக்கு பழுது நீக்கப்படவில்லை'), petitioner: 'S. Bhaskar', mobile: '93xxx 77410', village: bi('Hosur ward 21', 'ஓசூர் வார்டு 21'), dept: bi('Municipality', 'நகராட்சி'), channel: bi('Makkaludan Mudhalvar', 'மக்களுடன் முதல்வர்'), age: 39, officer: 'V. Anand', designation: DESIG.commissioner, phone: '+914344245000' },
  { id: 'GD/KRI/9902', subject: bi('School compound wall collapsed', 'பள்ளி சுற்றுச்சுவர் இடிந்தது'), petitioner: 'P. Thangam', mobile: '80xxx 90188', village: bi('Veppanapalli', 'வேப்பனப்பள்ளி'), dept: bi('Education', 'கல்வி'), channel: bi('Grievance Day', 'மனுநீதி நாள்'), age: 33, officer: 'M. Rajendran', designation: DESIG.ceo, phone: '+914343250099' },
  { id: 'CM/KRI/88390', subject: bi('MGNREGS wages delayed 5 weeks', 'நூறு நாள் வேலை ஊதியம் 5 வாரம் தாமதம்'), petitioner: 'G. Kannan', mobile: '87xxx 33440', village: bi('Thally', 'தளி'), dept: bi('Rural development', 'ஊரக வளர்ச்சி'), channel: bi('CM Cell', 'முதல்வர் தனிப்பிரிவு'), age: 31, officer: 'S. Manivannan', designation: DESIG.bdo, phone: '+914344234567' },
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
    { key: 'ch', head: bi('Channel', 'வழி'), text: (row) => t(row.label) },
    { key: 'rec', head: bi('Received', 'பெறப்பட்டது'), align: 'right', text: (row) => num(row.received) },
    { key: 'dis', head: bi('Disposed', 'தீர்வு'), align: 'right', text: (row) => num(row.disposed) },
    { key: 'pen', head: bi('Pending', 'நிலுவை'), align: 'right', text: (row) => num(row.pending) },
    {
      key: 'over',
      head: bi('Beyond 30 days', '30 நாட்களுக்கு மேல்'),
      align: 'right',
      text: (row) => num(row.over30),
      render: (row) => (
        <Status tone={row.over30 > 30 ? 'critical' : row.over30 > 15 ? 'serious' : 'good'} label={num(row.over30)} />
      ),
    },
    {
      key: 'rate',
      head: bi('Disposal', 'தீர்வு விகிதம்'),
      align: 'right',
      text: (row) => pct((row.disposed / row.received) * 100),
      minor: true,
    },
  ]

  const petitionColumns: Column<Petition>[] = [
    {
      key: 'subject',
      head: bi('Petition', 'மனு'),
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
    { key: 'pet', head: bi('Petitioner', 'மனுதாரர்'), text: (row) => `${row.petitioner} · ${row.mobile}` },
    { key: 'village', head: bi('Village', 'கிராமம்'), text: (row) => t(row.village), minor: true },
    { key: 'dept', head: bi('Department', 'துறை'), text: (row) => t(row.dept) },
    {
      key: 'age',
      head: bi('Age', 'காலம்'),
      align: 'right',
      text: (row) => `${row.age} d`,
      render: (row) => (
        <Status tone={row.age > 60 ? 'critical' : row.age > 45 ? 'serious' : 'warning'} label={`${row.age} d`} />
      ),
    },
    { key: 'officer', head: bi('With officer', 'அலுவலரிடம்'), text: (row) => row.officer },
  ]

  return (
    <div className="flex flex-col gap-4">
      <PageHead
        title={bi('Grievances & CM cell', 'மனுக்கள் & முதல்வர் தனிப்பிரிவு')}
        note={bi('All channels · disposal and ageing', 'அனைத்து வழிகள் · தீர்வு மற்றும் காலநிலை')}
        icon="mark_email_unread"
      />

      <StatGrid>
        <Stat label={bi('Received (FY)', 'பெறப்பட்டது (நிதியாண்டு)')} value={num(received)} />
        <Stat label={bi('Disposed', 'தீர்வு')} value={num(disposed)} delta={pct((disposed / received) * 100)} deltaTone="good" meter={(disposed / received) * 100} meterTone="good" />
        <Stat label={bi('Pending', 'நிலுவை')} value={num(pending)} deltaTone="bad" />
        <Stat label={bi('Beyond 30 days', '30 நாட்களுக்கு மேல்')} value={num(over30)} delta={t(bi('Collector review', 'ஆட்சியர் ஆய்வு'))} deltaTone="bad" />
        <Stat label={bi('Avg disposal time', 'சராசரி தீர்வு காலம்')} value="11.4" unit={t(bi('days', 'நாட்கள்'))} delta="-2.1" deltaTone="good" />
      </StatGrid>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <PanelHead
            icon="grid_view"
            title={bi('Ageing by department', 'துறைவாரி காலநிலை')}
            note={bi('Pending petitions in each age bucket', 'ஒவ்வொரு கால அடுக்கிலும் நிலுவை மனுக்கள்')}
            actions={
              <Segmented
                value={view}
                onChange={setView}
                options={[
                  { value: 'age', label: bi('Ageing', 'காலநிலை') },
                  { value: 'channel', label: bi('Channel', 'வழி') },
                ]}
              />
            }
          />
          {view === 'age' ? (
            <Heatmap
              rows={DEPT_AGE}
              columns={AGE_COLS}
              legend={bi('Fewer → more pending', 'குறைவு → அதிக நிலுவை')}
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
            title={bi('Pending by channel', 'வழிவாரி நிலுவை')}
            note={bi('Live count', 'நேரலை எண்ணிக்கை')}
          />
          <Donut
            centerValue={num(pending)}
            centerLabel={bi('pending', 'நிலுவை')}
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
              380 {t(bi('petitions queued', 'மனுக்கள் வரிசையில்'))}
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
          title={bi('Oldest pending petitions', 'மிக நீண்ட நிலுவை மனுக்கள்')}
          note={bi('Open a row for petitioner contact and the officer holding it', 'மனுதாரர் தொடர்பு மற்றும் அலுவலர் விவரத்திற்கு வரிசையைத் திறக்கவும்')}
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
              status: `${row.age} ${t(bi('days pending', 'நாட்கள் நிலுவை'))}`,
              facts: [
                { label: bi('Petitioner', 'மனுதாரர்'), value: row.petitioner },
                { label: bi('Mobile', 'கைபேசி'), value: row.mobile },
                { label: bi('Village', 'கிராமம்'), value: t(row.village) },
                { label: bi('Department', 'துறை'), value: t(row.dept) },
                { label: bi('Channel', 'வழி'), value: t(row.channel) },
                { label: bi('Age', 'காலம்'), value: `${row.age} days` },
              ],
              officer: { name: row.officer, designation: row.designation, phone: row.phone },
              audit: { updated: '24 Oct 07:05', by: 'Grievance monitoring cell', source: SRC.cmcell },
              actions: [
                { label: bi('Fix deadline', 'காலக்கெடு நிர்ணயி'), icon: 'schedule', variant: 'accent' },
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
