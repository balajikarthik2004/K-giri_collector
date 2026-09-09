import { useState } from 'react'
import { bi, num, useI18n } from '../i18n'
import { ui } from '../i18n/ui'
import { Icon } from '../components/Icon'
import { PageHead } from '../components/ui/PageHead'
import { Btn, Panel, PanelHead, Stat, StatGrid, Status, Tag } from '../components/ui/Primitives'
import { Sparkline } from '../components/ui/Charts'
import { DrillDrawer, type Drill } from '../components/ui/Drawer'
import { DESIG, SRC } from '../data/common'
import { useApp } from '../app/store'

/* ---------------- Today's diary ---------------- */

const SCHEDULE = [
  {
    from: '09:00',
    to: '10:15',
    title: bi('File clearance — Collector chamber', 'கோப்பு அனுமதி — ஆட்சியர் அறை'),
    place: bi('14 files pending signature', '14 கோப்புகள் கையொப்பத்திற்கு'),
    kind: bi('Desk', 'மேசை'),
    tone: 'neutral' as const,
  },
  {
    from: '10:30',
    to: '13:00',
    title: bi('Grievance day — public hearing', 'மனுநீதி நாள் — பொதுமக்கள் விசாரணை'),
    place: bi('Collectorate hall · 380 petitions', 'ஆட்சியர் அரங்கம் · 380 மனுக்கள்'),
    kind: bi('Public', 'பொது'),
    tone: 'info' as const,
  },
  {
    from: '14:30',
    to: '16:00',
    title: bi('Chief Secretary video conference', 'தலைமைச் செயலாளர் காணொலிக் கூட்டம்'),
    place: bi('Jal Jeevan Mission · Breakfast scheme Phase-II', 'ஜல் ஜீவன் திட்டம் · காலை உணவுத் திட்டம் கட்டம்-II'),
    kind: bi('Priority', 'முன்னுரிமை'),
    tone: 'critical' as const,
  },
  {
    from: '16:45',
    to: '18:30',
    title: bi('SIPCOT Phase III site inspection', 'சிப்காட் கட்டம்-III கள ஆய்வு'),
    place: bi('Moranapalli, Hosur North', 'மோரனப்பள்ளி, ஓசூர் வடக்கு'),
    kind: bi('Field', 'களம்'),
    tone: 'neutral' as const,
  },
]

const VIP = [
  {
    who: bi('Hon. Minister, Rural Development', 'மாண்புமிகு அமைச்சர், ஊரக வளர்ச்சி'),
    when: bi('26 Oct · 11:00', 'அக் 26 · 11:00'),
    what: bi('Kalaignar Kanavu Illam handover, Kaveripattinam', 'கலைஞர் கனவு இல்லம் ஒப்படைப்பு, காவேரிப்பட்டினம்'),
  },
  {
    who: bi('Secretary, Industries', 'செயலாளர், தொழில் துறை'),
    when: bi('28 Oct · 15:30', 'அக் 28 · 15:30'),
    what: bi('EV ancillary cluster review, Hosur', 'மின்சார வாகன துணைக் கொத்து ஆய்வு, ஓசூர்'),
  },
  {
    who: bi('District MP', 'மாவட்ட நாடாளுமன்ற உறுப்பினர்'),
    when: bi('29 Oct · 10:00', 'அக் 29 · 10:00'),
    what: bi('DISHA committee meeting', 'திசை குழு கூட்டம்'),
  },
]

const COURT = [
  {
    ref: 'WP 2841/24',
    title: bi('Shoolagiri Periya Eri encroachment', 'சூளகிரி பெரிய ஏரி ஆக்கிரமிப்பு'),
    due: bi('Counter affidavit due tomorrow', 'எதிர் பிரமாணப் பத்திரம் நாளை'),
    tone: 'critical' as const,
    days: 1,
  },
  {
    ref: 'WP 3190/24',
    title: bi('Hosur bypass land compensation', 'ஓசூர் புறவழிச்சாலை நில இழப்பீடு'),
    due: bi('Compliance report in 4 days', 'இணக்க அறிக்கை 4 நாட்களில்'),
    tone: 'serious' as const,
    days: 4,
  },
  {
    ref: 'CONT 44/24',
    title: bi('Pochampalli patta contempt notice', 'போச்சம்பள்ளி பட்டா அவமதிப்பு அறிவிப்பு'),
    due: bi('Personal appearance in 9 days', 'நேரில் ஆஜர் 9 நாட்களில்'),
    tone: 'warning' as const,
    days: 9,
  },
]

const OVERNIGHT = [
  {
    ref: 'CM/KRI/88214',
    title: bi('Drinking water shortage — Berigai panchayat', 'குடிநீர் தட்டுப்பாடு — பேரிகை ஊராட்சி'),
    from: bi('CM Cell', 'முதல்வர் தனிப்பிரிவு'),
    officer: bi('BDO Shoolagiri', 'ஒன்றிய அலுவலர், சூளகிரி'),
    tone: 'critical' as const,
  },
  {
    ref: 'US/KRI/40122',
    title: bi('Patta transfer delay — Kelamangalam', 'பட்டா மாற்றம் தாமதம் — கேளமங்கலம்'),
    from: bi('Ungaludan Stalin', 'உங்களுடன் ஸ்டாலின்'),
    officer: bi('Tahsildar Denkanikottai', 'வட்டாட்சியர், தேன்கனிக்கோட்டை'),
    tone: 'serious' as const,
  },
  {
    ref: 'PG/KRI/7781',
    title: bi('Pension arrears — 3 months', 'ஓய்வூதிய நிலுவை — 3 மாதங்கள்'),
    from: bi('CPGRAMS', 'மத்திய மனு தளம்'),
    officer: bi('DSWO', 'மாவட்ட சமூக நல அலுவலர்'),
    tone: 'warning' as const,
  },
]

const LAW_FLASH = [
  {
    label: bi('Cognisable FIRs (24 h)', 'குற்றவியல் வழக்குகள் (24 மணி)'),
    value: '14',
    tone: 'neutral' as const,
  },
  {
    label: bi('Road fatalities NH-44', 'சாலை உயிரிழப்பு தே.நெ. 44'),
    value: '1',
    tone: 'serious' as const,
  },
  {
    label: bi('Prohibition raids', 'மதுவிலக்கு சோதனை'),
    value: '6',
    tone: 'neutral' as const,
  },
  {
    label: bi('Communal / law-order incidents', 'அமைதிக் கேடு சம்பவங்கள்'),
    value: '0',
    tone: 'good' as const,
  },
]

const RAIN_7D = [4.2, 0, 8.6, 12.1, 6.4, 18.2, 14.2]

export function OverviewPage() {
  const { t } = useI18n()
  const { go, notify } = useApp()
  const [drill, setDrill] = useState<Drill | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <PageHead
        title={bi('My day at a glance', 'என் நாள் — ஒரே பார்வையில்')}
        note={bi('24 Oct 2024 · Thursday', 'அக்டோபர் 24, 2024 · வியாழன்')}
        icon="overview"
      />

      {/* ---- Top strip ---- */}
      <StatGrid>
        <Stat
          label={bi('Files awaiting my signature', 'என் கையொப்பத்திற்கு')}
          value="14"
          delta={t(bi('6 urgent', '6 அவசரம்'))}
          deltaTone="bad"
          footnote={bi('e-Mudhra token connected', 'இ-முத்ரா டோக்கன் இணைக்கப்பட்டது')}
          onClick={() => go('actions')}
        />
        <Stat
          label={bi('Escalated overnight', 'இரவில் மேல்முறையீடு')}
          value="9"
          delta={t(bi('3 CM Cell', '3 முதல்வர் பிரிவு'))}
          deltaTone="bad"
          onClick={() => go('grievances')}
        />
        <Stat
          label={bi('SLA breaches', 'கால வரம்பு மீறல்')}
          value="59"
          delta={t(bi('+4 today', 'இன்று +4'))}
          deltaTone="bad"
          onClick={() => go('actions')}
        />
        <Stat
          label={bi('Court deadlines this week', 'இந்த வார நீதிமன்ற காலக்கெடு')}
          value="3"
          footnote={bi('1 due tomorrow', '1 நாளை')}
        />
        <Stat
          label={bi('DBT released today', 'இன்று வழங்கிய நேரடி நிதி')}
          value="₹14.82"
          unit="Cr"
          delta="99.4%"
          deltaTone="good"
          meter={99.4}
          meterTone="good"
          onClick={() => go('schemes')}
        />
      </StatGrid>

      <div className="grid gap-4 xl:grid-cols-3">
        {/* ---- Diary ---- */}
        <Panel className="xl:col-span-2">
          <PanelHead
            icon="event"
            title={bi("Today's schedule", 'இன்றைய நிகழ்ச்சி நிரல்')}
            note={bi('4 engagements · 1 high priority', '4 நிகழ்வுகள் · 1 முன்னுரிமை')}
            actions={<Btn icon="add" label={bi('Block time', 'நேரம் ஒதுக்கு')} />}
          />
          <ol className="flex flex-col gap-2">
            {SCHEDULE.map((item) => (
              <li
                key={item.from}
                className={`flex flex-col gap-1 rounded p-2.5 sm:flex-row sm:items-center sm:gap-3 ${
                  item.tone === 'critical'
                    ? 'border-l-4 border-error bg-error-container/40'
                    : 'bg-surface-container-low'
                }`}
              >
                <span className="shrink-0 font-label-md text-label-md font-bold tabular-nums text-primary">
                  {item.from}
                  <span className="text-on-surface-variant">–{item.to}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-label-md text-label-md font-bold text-on-surface">
                    {t(item.title)}
                  </span>
                  <span className="block font-body-sm text-body-sm text-on-surface-variant">
                    {t(item.place)}
                  </span>
                </span>
                <Status tone={item.tone} label={item.kind} />
              </li>
            ))}
          </ol>
        </Panel>

        {/* ---- Weather / rainfall ---- */}
        <Panel>
          <PanelHead
            icon="rainy"
            title={bi('Weather & rainfall', 'வானிலை & மழையளவு')}
            note={bi('Mango belt and Kaveri-fed tracts', 'மாந்தோப்பு மற்றும் காவேரி பாசனப் பகுதி')}
          />
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="font-telemetry-metric text-telemetry-metric text-on-surface">28°C</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {t(bi('Krishnagiri HQ · humid', 'கிருஷ்ணகிரி தலைமையகம் · ஈரப்பதம்'))}
              </p>
            </div>
            <Status tone="good" label={bi('No warning', 'எச்சரிக்கை இல்லை')} />
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { label: bi('Today', 'இன்று'), value: '14.2 mm' },
              { label: bi('Season', 'பருவம்'), value: '412 mm' },
              { label: bi('vs normal', 'இயல்பை விட'), value: '+8%' },
            ].map((item) => (
              <div key={t(item.label)} className="rounded bg-surface-container-low p-2">
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  {t(item.label)}
                </p>
                <p className="font-label-md text-label-md font-bold text-on-surface">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-3 mb-1 font-label-sm text-label-sm text-on-surface-variant">
            {t(bi('Last 7 days (mm)', 'கடந்த 7 நாட்கள் (மி.மீ)'))}
          </p>
          <Sparkline values={RAIN_7D} height={38} />

          <div className="mt-3 flex flex-col gap-1.5">
            {[
              { name: bi('Kelavarapalli', 'கெலவரப்பள்ளி'), level: '38.4 / 44 ft', pctFull: 87 },
              { name: bi('Barur', 'பர்கூர்'), level: '21.6 / 28 ft', pctFull: 77 },
              { name: bi('Pambar', 'பாம்பாறு'), level: '9.8 / 16 ft', pctFull: 61 },
            ].map((dam) => (
              <div key={t(dam.name)}>
                <div className="flex items-baseline justify-between">
                  <span className="font-label-sm text-label-sm font-semibold text-on-surface">
                    {t(dam.name)}
                  </span>
                  <span className="font-label-sm text-label-sm tabular-nums text-on-surface-variant">
                    {dam.level}
                  </span>
                </div>
                <span className="mt-0.5 block h-1.5 overflow-hidden rounded-full bg-surface-container">
                  <span
                    className="block h-full rounded-full bg-viz-1"
                    style={{ width: `${dam.pctFull}%` }}
                  />
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-3">
        {/* ---- Overnight escalations ---- */}
        <Panel>
          <PanelHead
            icon="notifications_active"
            title={bi('Escalated overnight', 'இரவில் மேல்முறையீடு')}
            note={bi('Petitions raised to Collector', 'ஆட்சியருக்கு அனுப்பப்பட்ட மனுக்கள்')}
            actions={<Btn icon="arrow_forward" onClick={() => go('grievances')} title={t(ui.drillDown)} variant="ghost" />}
          />
          <ul className="flex flex-col gap-2">
            {OVERNIGHT.map((item) => (
              <li key={item.ref}>
                <button
                  type="button"
                  onClick={() =>
                    setDrill({
                      title: t(item.title),
                      ref: item.ref,
                      tone: item.tone,
                      status: bi('Escalated', 'மேல்முறையீடு'),
                      facts: [
                        { label: bi('Channel', 'வழி'), value: t(item.from) },
                        { label: bi('With officer', 'அலுவலரிடம்'), value: t(item.officer) },
                        { label: bi('Age', 'காலம்'), value: '2 days' },
                        { label: bi('Petitioner', 'மனுதாரர்'), value: 'R. Selvarani · 94xxx 21870' },
                      ],
                      officer: { name: 'S. Manivannan', designation: DESIG.bdo, phone: '+914344234567' },
                      audit: { updated: '24 Oct 06:12', by: 'CM Cell auto-route', source: SRC.cmcell },
                      actions: [{ label: ui.escalate, icon: 'trending_up' }],
                    })
                  }
                  className="w-full rounded bg-surface-container-low p-2.5 text-left transition-colors hover:bg-surface-container"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-label-sm text-label-sm text-on-surface-variant">
                      {item.ref}
                    </span>
                    <Status tone={item.tone} label={item.from} compact />
                  </div>
                  <p className="mt-0.5 font-label-md text-label-md font-bold text-on-surface">
                    {t(item.title)}
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {t(item.officer)}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        {/* ---- Court ---- */}
        <Panel>
          <PanelHead
            icon="gavel"
            title={bi('Court directions', 'நீதிமன்ற உத்தரவுகள்')}
            note={bi('Madras High Court — deadlines', 'சென்னை உயர் நீதிமன்றம் — காலக்கெடு')}
          />
          <ul className="flex flex-col gap-2">
            {COURT.map((item) => (
              <li key={item.ref} className="rounded bg-surface-container-low p-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-label-sm text-label-sm text-on-surface-variant">
                    {item.ref}
                  </span>
                  <Status
                    tone={item.tone}
                    label={`${item.days} ${t(ui.days)}`}
                  />
                </div>
                <p className="mt-0.5 font-label-md text-label-md font-bold text-on-surface">
                  {t(item.title)}
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{t(item.due)}</p>
              </li>
            ))}
          </ul>
        </Panel>

        {/* ---- VIP + law & order ---- */}
        <div className="flex flex-col gap-4">
          <Panel>
            <PanelHead
              icon="star"
              title={bi('VIP visits', 'முக்கிய பிரமுகர் வருகை')}
              note={bi('Next 7 days', 'அடுத்த 7 நாட்கள்')}
            />
            <ul className="flex flex-col gap-2">
              {VIP.map((item) => (
                <li key={t(item.who)} className="rounded bg-surface-container-low p-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-label-md text-label-md font-bold text-on-surface">
                      {t(item.who)}
                    </p>
                    <Tag label={item.when} />
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {t(item.what)}
                  </p>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel>
            <PanelHead
              icon="local_police"
              title={bi('Law & order flash', 'சட்டம் ஒழுங்கு நிலவரம்')}
              note={bi('Last 24 hours · SP control room', 'கடந்த 24 மணி · காவல் கட்டுப்பாட்டு அறை')}
            />
            <ul className="grid grid-cols-2 gap-2">
              {LAW_FLASH.map((item) => (
                <li key={t(item.label)} className="rounded bg-surface-container-low p-2">
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    {t(item.label)}
                  </p>
                  <p className="mt-0.5 flex items-baseline gap-1.5">
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      {item.value}
                    </span>
                    {item.tone !== 'neutral' && (
                      <Status
                        tone={item.tone}
                        label={item.tone === 'good' ? ui.normal : ui.watch}
                        compact
                      />
                    )}
                  </p>
                </li>
              ))}
            </ul>
            <Btn
              full
              icon="ios_share"
              label={ui.pushMobile}
              onClick={() => notify(ui.pushed)}
            />
          </Panel>
        </div>
      </div>

      <p className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
        <Icon name="verified_user" className="text-sm text-good" />
        {t(ui.liveTelemetry)} · {t(ui.offlineHint)} · {num(15)} {t(bi('modules', 'தொகுதிகள்'))}
      </p>

      <DrillDrawer drill={drill} onClose={() => setDrill(null)} />
    </div>
  )
}
