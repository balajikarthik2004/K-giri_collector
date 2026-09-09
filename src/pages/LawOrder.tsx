import { useState } from 'react'
import { bi, num, useI18n, type Bi } from '../i18n'
import { PageHead } from '../components/ui/PageHead'
import { Panel, PanelHead, Segmented, Stat, StatGrid, Status, Tag } from '../components/ui/Primitives'
import { ColumnChart, Heatmap, SERIES, Sparkline } from '../components/ui/Charts'
import { DataTable, type Column } from '../components/ui/DataTable'
import { DrillDrawer, type Drill } from '../components/ui/Drawer'
import { DESIG, MONTHS, SRC, TALUK_LIST } from '../data/common'

const CRIME: { label: Bi; values: number[] }[] = TALUK_LIST.map((taluk, index) => ({
  label: taluk,
  values: [
    [18, 6, 4, 12],
    [34, 11, 9, 21],
    [12, 4, 2, 8],
    [9, 3, 1, 6],
    [11, 5, 3, 7],
    [8, 2, 1, 5],
    [16, 7, 4, 10],
  ][index],
}))

const CRIME_COLS: Bi[] = [
  bi('Property', 'சொத்து'),
  bi('Body', 'உடல்'),
  bi('Women', 'மகளிர்'),
  bi('Prohibition', 'மதுவிலக்கு'),
]

type Sensitive = {
  id: string
  place: Bi
  category: Bi
  lastIncident: string
  picketing: Bi
  tone: 'good' | 'warning' | 'serious' | 'critical'
}

const SENSITIVE: Sensitive[] = [
  { id: 's1', place: bi('Hosur old town', 'ஓசூர் பழைய நகரம்'), category: bi('Communally sensitive', 'மத ரீதியாக உணர்வுபூர்வம்'), lastIncident: '11 Aug 2024', picketing: bi('2 sections', '2 பிரிவுகள்'), tone: 'warning' },
  { id: 's2', place: bi('Kaveripattinam bazaar', 'காவேரிப்பட்டினம் சந்தை'), category: bi('Festival flashpoint', 'திருவிழா உணர்வுப் பகுதி'), lastIncident: '02 Sep 2024', picketing: bi('1 section', '1 பிரிவு'), tone: 'warning' },
  { id: 's3', place: bi('Denkanikottai forest fringe', 'தேன்கனிக்கோட்டை வனப் பகுதி'), category: bi('Inter-state movement', 'மாநிலங்களுக்கு இடையேயான நடமாட்டம்'), lastIncident: '28 Sep 2024', picketing: bi('Check post', 'சோதனைச் சாவடி'), tone: 'serious' },
  { id: 's4', place: bi('NH-44 Shoolagiri stretch', 'தே.நெ 44 சூளகிரி பகுதி'), category: bi('Accident black spot', 'விபத்து அபாய இடம்'), lastIncident: '23 Oct 2024', picketing: bi('Highway patrol', 'நெடுஞ்சாலை ரோந்து'), tone: 'critical' },
]

const RTA = [
  { label: MONTHS[0], a: 14, b: 9 },
  { label: MONTHS[1], a: 12, b: 7 },
  { label: MONTHS[2], a: 18, b: 11 },
  { label: MONTHS[3], a: 16, b: 10 },
  { label: MONTHS[4], a: 13, b: 8 },
  { label: MONTHS[5], a: 11, b: 6 },
]

type Relief = {
  id: string
  centre: Bi
  taluk: Bi
  capacity: number
  readiness: number
  tone: 'good' | 'warning' | 'serious'
}

const RELIEF: Relief[] = [
  { id: 'r1', centre: bi('Govt. Boys HSS, Krishnagiri', 'அரசு மேல்நிலைப் பள்ளி, கிருஷ்ணகிரி'), taluk: TALUK_LIST[0], capacity: 420, readiness: 96, tone: 'good' },
  { id: 'r2', centre: bi('Corporation school, Hosur', 'மாநகராட்சி பள்ளி, ஓசூர்'), taluk: TALUK_LIST[1], capacity: 380, readiness: 92, tone: 'good' },
  { id: 'r3', centre: bi('Community hall, Denkanikottai', 'சமுதாயக் கூடம், தேன்கனிக்கோட்டை'), taluk: TALUK_LIST[2], capacity: 240, readiness: 74, tone: 'warning' },
  { id: 'r4', centre: bi('Panchayat union office, Uthangarai', 'ஊராட்சி ஒன்றிய அலுவலகம், ஊத்தங்கரை'), taluk: TALUK_LIST[4], capacity: 180, readiness: 61, tone: 'serious' },
]

export function LawOrderPage() {
  const { t } = useI18n()
  const [drill, setDrill] = useState<Drill | null>(null)
  const [tab, setTab] = useState<'crime' | 'disaster'>('crime')

  const sensitiveColumns: Column<Sensitive>[] = [
    { key: 'place', head: bi('Location', 'இடம்'), text: (row) => t(row.place) },
    { key: 'cat', head: bi('Category', 'வகை'), text: (row) => t(row.category) },
    { key: 'last', head: bi('Last incident', 'கடைசி சம்பவம்'), text: (row) => row.lastIncident, minor: true },
    {
      key: 'picket',
      head: bi('Deployment', 'பாதுகாப்பு'),
      text: (row) => t(row.picketing),
      render: (row) => <Status tone={row.tone} label={row.picketing} />,
    },
  ]

  const reliefColumns: Column<Relief>[] = [
    { key: 'centre', head: bi('Relief centre', 'நிவாரண மையம்'), text: (row) => t(row.centre) },
    { key: 'taluk', head: bi('Taluk', 'வட்டம்'), text: (row) => t(row.taluk), minor: true },
    { key: 'cap', head: bi('Capacity', 'கொள்ளளவு'), align: 'right', text: (row) => num(row.capacity) },
    {
      key: 'ready',
      head: bi('Readiness', 'தயார் நிலை'),
      align: 'right',
      text: (row) => `${row.readiness}%`,
      render: (row) => <Status tone={row.tone} label={`${row.readiness}%`} />,
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <PageHead
        title={bi('Law, order & disaster', 'சட்டம், ஒழுங்கு & பேரிடர்')}
        note={bi('Crime picture, sensitive spots, road safety, relief readiness', 'குற்ற நிலவரம், உணர்வுப் பகுதிகள், சாலைப் பாதுகாப்பு, நிவாரணத் தயார்நிலை')}
        icon="shield"
      />

      <StatGrid>
        <Stat label={bi('Cognisable FIRs (24 h)', 'குற்றவியல் வழக்கு (24 மணி)')} value="14" delta={t(bi('0 major', 'பெரிய சம்பவம் இல்லை'))} deltaTone="good" />
        <Stat label={bi('Road fatalities (FY)', 'சாலை உயிரிழப்பு')} value="84" delta="-11%" deltaTone="good" />
        <Stat label={bi('Missing women / children', 'காணாமல் போனோர்')} value="12" delta={t(bi('9 traced', '9 கண்டறியப்பட்டது'))} deltaTone="good" />
        <Stat label={bi('Prohibition cases (30 d)', 'மதுவிலக்கு வழக்கு')} value="178" />
        <Stat label={bi('Relief centres ready', 'தயார் நிவாரண மையம்')} value="42 / 48" delta="87.5%" deltaTone="good" meter={87.5} meterTone="good" />
      </StatGrid>

      <Panel>
        <PanelHead
          icon="local_police"
          title={bi('District picture', 'மாவட்ட நிலவரம்')}
          note={bi('Switch between crime and disaster readiness', 'குற்ற நிலவரம் மற்றும் பேரிடர் தயார்நிலை')}
          actions={
            <Segmented
              value={tab}
              onChange={setTab}
              options={[
                { value: 'crime', label: bi('Crime', 'குற்றம்') },
                { value: 'disaster', label: bi('Disaster', 'பேரிடர்') },
              ]}
            />
          }
        />
        {tab === 'crime' ? (
          <Heatmap
            rows={CRIME}
            columns={CRIME_COLS}
            legend={bi('Fewer → more FIRs (30 days)', 'குறைவு → அதிக வழக்குகள் (30 நாட்கள்)')}
          />
        ) : (
          <DataTable
            columns={reliefColumns}
            rows={RELIEF}
            rowKey={(row) => row.id}
            searchable={false}
            exportName="krishnagiri-relief-centres"
            onRowClick={(row) =>
              setDrill({
                title: t(row.centre),
                ref: row.id.toUpperCase(),
                tone: row.tone,
                status: `${row.readiness}%`,
                facts: [
                  { label: bi('Taluk', 'வட்டம்'), value: t(row.taluk) },
                  { label: bi('Capacity', 'கொள்ளளவு'), value: num(row.capacity) },
                  { label: bi('Readiness', 'தயார் நிலை'), value: `${row.readiness}%` },
                  { label: bi('Generator', 'மின்னாக்கி'), value: 'Available' },
                  { label: bi('Kitchen', 'சமையலறை'), value: 'Functional' },
                  { label: bi('Last drill', 'கடைசி ஒத்திகை'), value: '14 Sep 2024' },
                ],
                officer: { name: 'K. Sekar', designation: DESIG.tahsildar, phone: '+914343232102' },
                audit: { updated: '20 Oct 11:00', by: 'District disaster cell', source: SRC.cctns },
                actions: [{ label: bi('Order readiness check', 'தயார்நிலை சோதனை'), icon: 'checklist', variant: 'accent' }],
              })
            }
          />
        )}
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel>
          <PanelHead
            icon="warning"
            title={bi('Sensitive locations', 'உணர்வுப் பகுதிகள்')}
            note={bi('Standing watch list', 'நிரந்தர கண்காணிப்பு பட்டியல்')}
          />
          <DataTable
            columns={sensitiveColumns}
            rows={SENSITIVE}
            rowKey={(row) => row.id}
            searchable={false}
            dense
            exportName="krishnagiri-sensitive-locations"
            onRowClick={(row) =>
              setDrill({
                title: t(row.place),
                ref: row.id.toUpperCase(),
                tone: row.tone,
                status: row.category,
                facts: [
                  { label: bi('Category', 'வகை'), value: t(row.category) },
                  { label: bi('Last incident', 'கடைசி சம்பவம்'), value: row.lastIncident },
                  { label: bi('Deployment', 'பாதுகாப்பு'), value: t(row.picketing) },
                  { label: bi('CCTV', 'கண்காணிப்பு கேமரா'), value: '18 live' },
                ],
                officer: { name: 'S. Karthikeyan, IPS', designation: DESIG.sp, phone: '+914343230100' },
                audit: { updated: '24 Oct 06:30', by: 'SP control room', source: SRC.cctns },
                actions: [{ label: bi('Order patrol', 'ரோந்து உத்தரவு'), icon: 'local_police', variant: 'danger' }],
              })
            }
          />
        </Panel>

        <Panel>
          <PanelHead
            icon="directions_car"
            title={bi('Road accidents on NH-44 / NH-844', 'தே.நெ 44 / 844 சாலை விபத்து')}
            note={bi('Accidents and fatalities per month', 'மாதம் ஒன்றுக்கு விபத்து மற்றும் உயிரிழப்பு')}
          />
          <ColumnChart
            data={RTA}
            seriesA={bi('Accidents', 'விபத்து')}
            seriesB={bi('Fatalities', 'உயிரிழப்பு')}
            height={160}
          />
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Tag label={bi('4 black spots rectified', '4 அபாய இடம் சரிசெய்யப்பட்டது')} />
            <Tag label={bi('2 pending with NHAI', '2 தே.நெ.ஆ-விடம் நிலுவை')} />
          </div>
        </Panel>
      </div>

      <Panel>
        <PanelHead
          icon="flood"
          title={bi('Disaster monitoring', 'பேரிடர் கண்காணிப்பு')}
          note={bi('Rain gauges, tank sluices and response contacts', 'மழை அளவி, ஏரி மதகு மற்றும் தொடர்பு எண்')}
        />
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="mb-1 font-label-sm text-label-sm text-on-surface-variant">
              {t(bi('District rainfall — 7 days (mm)', 'மாவட்ட மழை — 7 நாட்கள் (மி.மீ)'))}
            </p>
            <Sparkline values={[4.2, 0, 8.6, 12.1, 6.4, 18.2, 14.2]} height={40} tone={SERIES[0]} />
            <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
              {t(bi('26 rain gauges reporting · 0 stations silent', '26 மழை அளவிகள் செயலில் · 0 செயலிழப்பு'))}
            </p>
          </div>
          <div className="rounded bg-surface-container-low p-3">
            <p className="font-label-sm text-label-sm font-bold text-on-surface-variant">
              {t(bi('Tank sluice status', 'ஏரி மதகு நிலை'))}
            </p>
            <ul className="mt-1.5 flex flex-col gap-1 font-body-sm text-body-sm text-on-surface">
              <li>{t(bi('Total tanks: 1,842', 'மொத்த ஏரிகள்: 1,842'))}</li>
              <li>{t(bi('Above 80% storage: 214', '80% மேல் நீர் இருப்பு: 214'))}</li>
              <li>{t(bi('Sluices under repair: 18', 'பழுதில் உள்ள மதகு: 18'))}</li>
              <li>{t(bi('Breach risk flagged: 3', 'உடைப்பு அபாயம்: 3'))}</li>
            </ul>
          </div>
          <div className="rounded bg-surface-container-low p-3">
            <p className="font-label-sm text-label-sm font-bold text-on-surface-variant">
              {t(bi('Response contact tree', 'மீட்பு தொடர்பு அமைப்பு'))}
            </p>
            <ul className="mt-1.5 flex flex-col gap-1.5">
              {[
                { name: bi('District Control Room', 'மாவட்ட கட்டுப்பாட்டு அறை'), phone: '1077' },
                { name: bi('SDRF Krishnagiri', 'மாநில பேரிடர் படை'), phone: '+914343234000' },
                { name: bi('NDRF Arakkonam', 'தேசிய பேரிடர் படை'), phone: '+914177230100' },
                { name: bi('Fire & Rescue', 'தீயணைப்பு மற்றும் மீட்பு'), phone: '101' },
              ].map((contact) => (
                <li key={contact.phone} className="flex items-center justify-between gap-2">
                  <span className="font-body-sm text-body-sm text-on-surface">{t(contact.name)}</span>
                  <a
                    href={`tel:${contact.phone}`}
                    className="rounded bg-primary px-2 py-0.5 font-label-sm text-label-sm font-bold text-on-primary"
                  >
                    {contact.phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Panel>

      <DrillDrawer drill={drill} onClose={() => setDrill(null)} />
    </div>
  )
}
