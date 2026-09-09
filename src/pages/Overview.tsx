import { useEffect, useRef, useState } from 'react'
import { bi, num, useI18n, type Bi } from '../i18n'
import { ui } from '../i18n/ui'
import { Icon } from '../components/Icon'
import { PageHead } from '../components/ui/PageHead'
import { Btn, Panel, PanelHead, Stat, StatGrid, Status, Tag } from '../components/ui/Primitives'
import { Sparkline } from '../components/ui/Charts'
import { DrillDrawer, type Drill } from '../components/ui/Drawer'
import { DESIG, SRC } from '../data/common'
import { useApp } from '../app/store'

/* ---------------- Today's diary ---------------- */

type Engagement = {
  from: string
  to: string
  title: Bi | string
  place: Bi | string
  kind: Bi | string
  tone: 'neutral' | 'info' | 'critical' | 'good' | 'warning' | 'serious'
}

const SCHEDULE_SEED: Engagement[] = [
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
    place: bi('Collectorate hall · 380 people waiting', 'ஆட்சியர் அரங்கம் · 380 பேர் காத்திருப்பு'),
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

/**
 * The three petitions the CM Cell / CPGRAMS routers pushed to the Collector
 * last night. Officer, petitioner and age mirror the same refs on the
 * Grievances page so the two screens never disagree.
 */
const OVERNIGHT = [
  {
    ref: 'CM/KRI/88214',
    title: bi('Drinking water shortage — Berigai panchayat', 'குடிநீர் தட்டுப்பாடு — பேரிகை ஊராட்சி'),
    from: bi('CM Cell', 'முதல்வர் தனிப்பிரிவு'),
    officer: bi('BDO Shoolagiri', 'ஒன்றிய அலுவலர், சூளகிரி'),
    officerName: 'S. Manivannan',
    designation: DESIG.bdo,
    phone: '+914344234567',
    petitioner: 'R. Selvarani · 94xxx 21870',
    ageDays: 68,
    escalatedAt: '24 Oct 06:12',
    tone: 'critical' as const,
  },
  {
    ref: 'US/KRI/40122',
    title: bi('Patta transfer delay — Kelamangalam', 'பட்டா மாற்றம் தாமதம் — கேளமங்கலம்'),
    from: bi('Ungaludan Stalin', 'உங்களுடன் ஸ்டாலின்'),
    officer: bi('Tahsildar Denkanikottai', 'வட்டாட்சியர், தேன்கனிக்கோட்டை'),
    officerName: 'R. Vinoth',
    designation: DESIG.tahsildar,
    phone: '+914347222104',
    petitioner: 'K. Munusamy · 90xxx 44120',
    ageDays: 54,
    escalatedAt: '24 Oct 05:48',
    tone: 'serious' as const,
  },
  {
    ref: 'PG/KRI/7781',
    title: bi('Old age pension not paid — 3 months', 'முதியோர் ஓய்வூதியம் வரவில்லை — 3 மாதம்'),
    from: bi('CPGRAMS', 'மத்திய மனு தளம்'),
    officer: bi('DSWO', 'மாவட்ட சமூக நல அலுவலர்'),
    officerName: 'D. Priya',
    designation: DESIG.dswo,
    phone: '+914343240011',
    petitioner: 'A. Lakshmi · 99xxx 10233',
    ageDays: 47,
    escalatedAt: '24 Oct 04:35',
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

/* ---------------- Block time ---------------- */

/** Add an hour to a "HH:MM" clock string, clamped to the end of the day. */
function plusHour(time: string) {
  const [hours, minutes] = time.split(':').map(Number)
  return `${String(Math.min(hours + 1, 23)).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

function BlockTimeDialog({
  suggestFrom,
  onCancel,
  onAdd,
}: {
  suggestFrom: string
  onCancel: () => void
  onAdd: (entry: Engagement) => void
}) {
  const { t } = useI18n()
  const [title, setTitle] = useState('')
  const [place, setPlace] = useState('')
  const [from, setFrom] = useState(suggestFrom)
  const [to, setTo] = useState(plusHour(suggestFrom))
  const firstRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    firstRef.current?.focus()
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onCancel()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  const valid = title.trim().length > 0 && to > from

  const submit = () => {
    if (!valid) return
    onAdd({
      from,
      to,
      title: title.trim(),
      place: place.trim() || t(bi('Collector chamber', 'ஆட்சியர் அறை')),
      kind: bi('Blocked', 'ஒதுக்கப்பட்டது'),
      tone: 'neutral',
    })
  }

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center p-4" data-print="hide">
      <button
        type="button"
        aria-label={t(ui.close)}
        onClick={onCancel}
        className="absolute inset-0 bg-black/45"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t(bi('Block time', 'நேரம் ஒதுக்கு'))}
        className="relative w-full max-w-sm rounded-lg border border-hairline bg-surface-container-lowest p-4 shadow-2xl"
      >
        <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
          {t(bi('Block time', 'நேரம் ஒதுக்கு'))}
        </h2>
        <p className="mt-0.5 mb-3 font-body-sm text-body-sm text-on-surface-variant">
          {t(bi("Adds a slot to today's diary", 'இன்றைய நிகழ்ச்சி நிரலில் சேர்க்கும்'))}
        </p>

        <div className="flex flex-col gap-2.5">
          <label className="flex flex-col gap-1">
            <span className="font-label-sm text-label-sm font-semibold text-on-surface-variant">
              {t(bi('What is it', 'எதற்கு'))}
            </span>
            <input
              ref={firstRef}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && submit()}
              placeholder={t(bi('Review with Tahsildars', 'வட்டாட்சியர்களுடன் ஆய்வு'))}
              className="rounded border border-hairline-strong bg-surface-container-low px-2.5 py-1.5 font-body-sm text-body-sm text-on-surface focus:border-primary focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-label-sm text-label-sm font-semibold text-on-surface-variant">
              {t(bi('Where', 'இடம்'))}
            </span>
            <input
              value={place}
              onChange={(event) => setPlace(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && submit()}
              placeholder={t(bi('Collector chamber', 'ஆட்சியர் அறை'))}
              className="rounded border border-hairline-strong bg-surface-container-low px-2.5 py-1.5 font-body-sm text-body-sm text-on-surface focus:border-primary focus:outline-none"
            />
          </label>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: bi('From', 'முதல்'), value: from, set: setFrom },
              { label: bi('To', 'வரை'), value: to, set: setTo },
            ].map((field) => (
              <label key={t(field.label)} className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm font-semibold text-on-surface-variant">
                  {t(field.label)}
                </span>
                <input
                  type="time"
                  value={field.value}
                  onChange={(event) => field.set(event.target.value)}
                  className="rounded border border-hairline-strong bg-surface-container-low px-2.5 py-1.5 font-body-sm text-body-sm tabular-nums text-on-surface focus:border-primary focus:outline-none"
                />
              </label>
            ))}
          </div>

          {!valid && (title.length > 0 || to <= from) && (
            <p className="font-label-sm text-label-sm text-crit">
              {title.trim().length === 0
                ? t(bi('Give it a name', 'ஒரு பெயர் கொடுங்கள்'))
                : t(bi('End time must be after the start', 'முடிவு நேரம் தொடக்கத்திற்குப் பின் இருக்க வேண்டும்'))}
            </p>
          )}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Btn label={ui.close} onClick={onCancel} />
          <Btn
            label={bi('Block it', 'ஒதுக்கு')}
            icon="event_available"
            variant="primary"
            onClick={submit}
          />
        </div>
      </div>
    </div>
  )
}

export function OverviewPage() {
  const { t } = useI18n()
  const { go, notify } = useApp()
  const [drill, setDrill] = useState<Drill | null>(null)
  const [schedule, setSchedule] = useState<Engagement[]>(SCHEDULE_SEED)
  const [blocking, setBlocking] = useState(false)

  const addEngagement = (entry: Engagement) => {
    setSchedule((current) =>
      [...current, entry].sort((a, b) => a.from.localeCompare(b.from)),
    )
    setBlocking(false)
    notify(bi("Time blocked in today's diary", 'இன்றைய நிகழ்ச்சி நிரலில் நேரம் ஒதுக்கப்பட்டது'))
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHead
        title={bi("Today's Overview", 'இன்றைய கண்ணோட்டம்')}
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
          label={bi('Came up overnight', 'இரவில் வந்தவை')}
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
            note={`${num(schedule.length)} ${t(bi('engagements', 'நிகழ்வுகள்'))} · ${num(
              schedule.filter((item) => item.tone === 'critical').length,
            )} ${t(bi('high priority', 'முன்னுரிமை'))}`}
            actions={
              <Btn
                icon="add"
                label={bi('Block time', 'நேரம் ஒதுக்கு')}
                variant="primary"
                onClick={() => setBlocking(true)}
              />
            }
          />
          <ol className="flex flex-col gap-2">
            {schedule.map((item) => (
              <li
                key={`${item.from}-${t(item.title)}`}
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
            note={bi('Mango belt · Thenpennai basin', 'மாந்தோப்பு · தென்பெண்ணை படுகை')}
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
              { label: bi('Since 1 Jun', 'ஜூன் 1 முதல்'), value: '412 mm' },
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
              { name: bi('Krishnagiri (KRP)', 'கிருஷ்ணகிரி (கே.ஆர்.பி)'), level: '42.1 / 52 ft', pctFull: 81 },
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
            title={bi('Came up overnight', 'இரவில் வந்தவை')}
            note={bi('Complaints sent to the Collector', 'ஆட்சியருக்கு அனுப்பப்பட்ட புகார்கள்')}
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
                      status: bi('Sent up', 'மேலிடத்திற்கு அனுப்பப்பட்டது'),
                      facts: [
                        { label: bi('How it came in', 'எப்படி வந்தது'), value: t(item.from) },
                        { label: bi('Who has it', 'யாரிடம் உள்ளது'), value: t(item.officer) },
                        {
                          label: bi('Waiting', 'காத்திருப்பு'),
                          value: `${num(item.ageDays)} ${t(ui.days)}`,
                        },
                        { label: bi('Who complained', 'புகார் அளித்தவர்'), value: item.petitioner },
                      ],
                      officer: {
                        name: item.officerName,
                        designation: item.designation,
                        phone: item.phone,
                      },
                      audit: { updated: item.escalatedAt, by: 'Grievance router', source: SRC.cmcell },
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
                    label={`${item.days} ${t(item.days === 1 ? ui.day : ui.days)}`}
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
          </Panel>
        </div>
      </div>

      <p className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
        <Icon name="verified_user" className="text-sm text-good" />
        {t(ui.liveTelemetry)} · {t(ui.offlineHint)} · {num(15)} {t(bi('modules', 'தொகுதிகள்'))}
      </p>

      {blocking && (
        <BlockTimeDialog
          suggestFrom={schedule.at(-1)?.to ?? '09:00'}
          onCancel={() => setBlocking(false)}
          onAdd={addEngagement}
        />
      )}

      <DrillDrawer drill={drill} onClose={() => setDrill(null)} />
    </div>
  )
}
