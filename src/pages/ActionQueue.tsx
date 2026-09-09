import { useMemo, useState } from 'react'
import { bi, num, useI18n, type Bi } from '../i18n'
import { ui } from '../i18n/ui'
import { Icon } from '../components/Icon'
import { PageHead } from '../components/ui/PageHead'
import { Btn, Panel, PanelHead, Segmented, Stat, StatGrid, Status, type Tone } from '../components/ui/Primitives'
import { DrillDrawer, type Drill } from '../components/ui/Drawer'
import { DESIG, SRC } from '../data/common'
import { useApp } from '../app/store'

type Kind = 'sla' | 'court' | 'vip' | 'sign' | 'redflag'

type Item = {
  id: string
  kind: Kind
  ref: string
  title: Bi
  detail: Bi
  owner: string
  designation: Bi
  phone: string
  deadline: Bi
  tone: Tone
  cta: Bi
  ctaIcon: string
}

const KIND_LABEL: Record<Kind, Bi> = {
  sla: bi('SLA breach', 'கால வரம்பு மீறல்'),
  court: bi('Court direction', 'நீதிமன்ற உத்தரவு'),
  vip: bi('VIP reference', 'முக்கிய பரிந்துரை'),
  sign: bi('Awaiting signature', 'கையொப்பம் நிலுவை'),
  redflag: bi('Red flag', 'சிவப்பு எச்சரிக்கை'),
}

const KIND_ICON: Record<Kind, string> = {
  sla: 'timer_off',
  court: 'gavel',
  vip: 'star',
  sign: 'draw',
  redflag: 'flag',
}

const ITEMS: Item[] = [
  {
    id: 'a1', kind: 'court', ref: 'WP 2841/24',
    title: bi('Counter affidavit — Shoolagiri Periya Eri', 'எதிர் பிரமாணப் பத்திரம் — சூளகிரி பெரிய ஏரி'),
    detail: bi('Draft vetted by Govt Pleader. Bench hears in 48 hours.', 'அரசு வழக்கறிஞர் சரிபார்த்த வரைவு. 48 மணி நேரத்தில் விசாரணை.'),
    owner: 'P. Devi', designation: DESIG.tahsildar, phone: '+914344222103',
    deadline: bi('Due tomorrow', 'நாளை'), tone: 'critical',
    cta: bi('Approve e-draft', 'மின் வரைவை ஒப்புதல்'), ctaIcon: 'check_circle',
  },
  {
    id: 'a2', kind: 'sign', ref: 'TRS-882109',
    title: bi('6 treasury sanctions — DMF & flood relief', '6 கருவூல ஒப்புதல் — கனிம நிதி & வெள்ள நிவாரணம்'),
    detail: bi('₹2.10 Cr school labs and ₹84 L farmer aid. e-Mudhra token connected.', '₹2.10 கோடி பள்ளி ஆய்வகம் மற்றும் ₹84 லட்சம் விவசாயி உதவி. இ-முத்ரா டோக்கன் இணைப்பில்.'),
    owner: 'P. Anandhi', designation: DESIG.ao, phone: '+914343235500',
    deadline: bi('Today', 'இன்று'), tone: 'serious',
    cta: bi('Sign batch', 'தொகுப்பில் கையொப்பம்'), ctaIcon: 'fingerprint',
  },
  {
    id: 'a3', kind: 'sla', ref: 'LA/HSR/892/24',
    title: bi('Hosur ring bypass — compensation stuck', 'ஓசூர் வளையச் சாலை — இழப்பீடு நிறுத்தம்'),
    detail: bi('₹8.4 Cr for 14 patta holders in Moranapalli. 4 days past SLA.', 'மோரனப்பள்ளியில் 14 பட்டாதாரர்களுக்கு ₹8.4 கோடி. 4 நாட்கள் தாமதம்.'),
    owner: 'K. Rajavel', designation: DESIG.dro, phone: '+914343233333',
    deadline: bi('+4 days overdue', '+4 நாட்கள் தாமதம்'), tone: 'critical',
    cta: bi('Call DRO', 'மா.வ.அ-வை அழை'), ctaIcon: 'call',
  },
  {
    id: 'a4', kind: 'vip', ref: 'REF/BGR/4401',
    title: bi('Bargur hill road — D-Note endorsement', 'பர்கூர் மலைச்சாலை — பரிந்துரை ஒப்புதல்'),
    detail: bi('Forest Stage-1 diversion for 8.2 km. Outlay ₹11.20 Cr.', '8.2 கி.மீ வனத் திருப்பம் கட்டம்-1. மதிப்பீடு ₹11.20 கோடி.'),
    owner: 'N. Saravanan', designation: DESIG.ee, phone: '+914344251200',
    deadline: bi('Due in 3 days', '3 நாட்களில்'), tone: 'warning',
    cta: bi('Endorse', 'ஒப்புதல்'), ctaIcon: 'approval',
  },
  {
    id: 'a5', kind: 'redflag', ref: 'DBT/EXC/2140',
    title: bi('2,140 PM-KISAN records without Aadhaar seeding', '2,140 பிரதமர் கிசான் பதிவுகளில் ஆதார் இணைப்பு இல்லை'),
    detail: bi('Uthangarai block. Payment cycle blocked until seeding.', 'ஊத்தங்கரை ஒன்றியம். இணைப்பு வரை பணப் பரிமாற்றம் நிறுத்தம்.'),
    owner: 'S. Manivannan', designation: DESIG.bdo, phone: '+914344234567',
    deadline: bi('Cycle closes in 6 days', '6 நாட்களில் சுழற்சி முடிவு'), tone: 'critical',
    cta: bi('Order camp', 'முகாம் உத்தரவு'), ctaIcon: 'campaign',
  },
  {
    id: 'a6', kind: 'sla', ref: 'CM/KRI/88214',
    title: bi('Berigai drinking water — 68 days open', 'பேரிகை குடிநீர் — 68 நாட்கள் நிலுவை'),
    detail: bi('CM Cell petition. Tanker supply running; permanent scheme pending.', 'முதல்வர் பிரிவு மனு. தொட்டி லாரி விநியோகம்; நிரந்தரத் திட்டம் நிலுவை.'),
    owner: 'S. Manivannan', designation: DESIG.bdo, phone: '+914344234567',
    deadline: bi('+38 days overdue', '+38 நாட்கள் தாமதம்'), tone: 'critical',
    cta: bi('Fix deadline', 'காலக்கெடு நிர்ணயி'), ctaIcon: 'schedule',
  },
  {
    id: 'a7', kind: 'redflag', ref: 'INFRA/SW/04',
    title: bi('Shoolagiri solid waste plant at 19%', 'சூளகிரி திடக்கழிவு ஆலை 19%'),
    detail: bi('₹8.9 Cr work; 14 months elapsed. Contractor show-cause pending.', '₹8.9 கோடி பணி; 14 மாதங்கள் கடந்தது. ஒப்பந்ததாரர் விளக்கம் நிலுவை.'),
    owner: 'N. Saravanan', designation: DESIG.ee, phone: '+914344251200',
    deadline: bi('Review overdue', 'ஆய்வு தாமதம்'), tone: 'serious',
    cta: bi('Issue show-cause', 'விளக்கம் கோரு'), ctaIcon: 'description',
  },
  {
    id: 'a8', kind: 'court', ref: 'CONT 44/24',
    title: bi('Pochampalli patta — contempt notice', 'போச்சம்பள்ளி பட்டா — அவமதிப்பு அறிவிப்பு'),
    detail: bi('Personal appearance ordered if not complied in 9 days.', '9 நாட்களில் இணங்கவில்லை எனில் நேரில் ஆஜராக உத்தரவு.'),
    owner: 'S. Kavitha', designation: DESIG.tahsildar, phone: '+914343222105',
    deadline: bi('9 days', '9 நாட்கள்'), tone: 'warning',
    cta: bi('Record compliance', 'இணக்கம் பதிவு'), ctaIcon: 'task_alt',
  },
]

export function ActionQueuePage() {
  const { t } = useI18n()
  const { notify } = useApp()
  const [filter, setFilter] = useState<Kind | 'all'>('all')
  const [drill, setDrill] = useState<Drill | null>(null)

  const items = useMemo(
    () => (filter === 'all' ? ITEMS : ITEMS.filter((item) => item.kind === filter)),
    [filter],
  )

  const count = (kind: Kind) => ITEMS.filter((item) => item.kind === kind).length

  return (
    <div className="flex flex-col gap-4">
      <PageHead
        title={ui.needsAttention}
        note={bi('One list: breaches, court deadlines, VIP references, signatures', 'ஒரே பட்டியல்: மீறல், நீதிமன்ற காலக்கெடு, பரிந்துரை, கையொப்பம்')}
        icon="priority_high"
      />

      <StatGrid>
        <Stat label={KIND_LABEL.sla} value={num(count('sla'))} delta={t(bi('59 district-wide', 'மாவட்டம் முழுவதும் 59'))} deltaTone="bad" />
        <Stat label={KIND_LABEL.court} value={num(count('court'))} delta={t(bi('1 due tomorrow', '1 நாளை'))} deltaTone="bad" />
        <Stat label={KIND_LABEL.vip} value={num(count('vip'))} />
        <Stat label={KIND_LABEL.sign} value="14" delta={t(bi('6 urgent', '6 அவசரம்'))} deltaTone="bad" />
        <Stat label={KIND_LABEL.redflag} value={num(count('redflag'))} delta={t(bi('data exceptions', 'தரவு விதிவிலக்கு'))} deltaTone="bad" />
      </StatGrid>

      <Panel>
        <PanelHead
          icon="checklist"
          title={bi('Decisions waiting on me', 'என் முடிவுக்காக காத்திருப்பவை')}
          note={bi('Ranked by consequence, then deadline', 'விளைவு, பின் காலக்கெடு அடிப்படையில்')}
          actions={
            <Segmented
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'all', label: ui.all },
                { value: 'sla', label: KIND_LABEL.sla },
                { value: 'court', label: KIND_LABEL.court },
                { value: 'sign', label: KIND_LABEL.sign },
              ]}
            />
          }
        />

        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li
              key={item.id}
              className={`flex flex-col gap-3 rounded-lg p-3 md:flex-row md:items-center ${
                item.tone === 'critical'
                  ? 'border-l-4 border-crit bg-crit/6'
                  : 'bg-surface-container-low'
              }`}
            >
              <span className="flex shrink-0 items-center gap-2">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    item.tone === 'critical'
                      ? 'bg-crit/12 text-crit'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  <Icon name={KIND_ICON[item.kind]} className="text-lg" />
                </span>
                <span className="md:hidden">
                  <Status tone={item.tone} label={item.deadline} />
                </span>
              </span>

              <button
                type="button"
                onClick={() =>
                  setDrill({
                    title: t(item.title),
                    ref: item.ref,
                    tone: item.tone,
                    status: KIND_LABEL[item.kind],
                    facts: [
                      { label: bi('Deadline', 'காலக்கெடு'), value: t(item.deadline) },
                      { label: bi('Owner', 'பொறுப்பு'), value: item.owner },
                      { label: bi('Category', 'வகை'), value: t(KIND_LABEL[item.kind]) },
                      { label: bi('Reference', 'குறிப்பு'), value: item.ref },
                    ],
                    officer: { name: item.owner, designation: item.designation, phone: item.phone },
                    audit: { updated: '24 Oct 07:00', by: 'Collector action engine', source: SRC.eservices },
                    actions: [{ label: item.cta, icon: item.ctaIcon, variant: 'primary' }],
                  })
                }
                className="min-w-0 flex-1 text-left"
              >
                <span className="flex flex-wrap items-center gap-1.5">
                  <span className="font-mono font-label-sm text-label-sm text-on-surface-variant">
                    {item.ref}
                  </span>
                  <span className="hidden md:inline">
                    <Status tone={item.tone} label={item.deadline} />
                  </span>
                </span>
                <span className="mt-0.5 block font-label-md text-label-md font-bold text-on-surface">
                  {t(item.title)}
                </span>
                <span className="block font-body-sm text-body-sm text-on-surface-variant">
                  {t(item.detail)}
                </span>
                <span className="mt-0.5 block font-label-sm text-label-sm text-on-surface-variant">
                  {item.owner} · {t(item.designation)}
                </span>
              </button>

              <span className="flex shrink-0 flex-wrap gap-1.5">
                <a
                  href={`tel:${item.phone}`}
                  className="inline-flex items-center gap-1.5 rounded bg-surface-container px-2.5 py-1.5 font-label-sm text-label-sm font-semibold text-on-surface hover:bg-surface-container-high"
                >
                  <Icon name="call" className="text-base" />
                  {t(ui.callOfficer)}
                </a>
                <Btn label={item.cta} icon={item.ctaIcon} variant="primary" onClick={() => notify(ui.copied)} />
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel>
        <PanelHead
          icon="ios_share"
          title={bi('Take it with me', 'என்னுடன் எடுத்துச் செல்')}
          note={bi('Review pack for the CS video conference and the Minister review', 'தலைமைச் செயலாளர் காணொலி மற்றும் அமைச்சர் ஆய்வுக்கான கோப்பு')}
        />
        <div className="flex flex-wrap gap-2">
          <Btn label={ui.print} icon="picture_as_pdf" variant="primary" onClick={() => window.print()} />
          <Btn label={ui.pushMobile} icon="smartphone" variant="accent" onClick={() => notify(ui.pushed)} />
          <Btn label={bi('Share with HoDs', 'துறைத் தலைவர்களுக்கு அனுப்பு')} icon="group_add" onClick={() => notify(ui.pushed)} />
        </div>
      </Panel>

      <DrillDrawer drill={drill} onClose={() => setDrill(null)} />
    </div>
  )
}
