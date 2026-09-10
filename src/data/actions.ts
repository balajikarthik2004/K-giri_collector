import { bi, type Bi } from '../i18n'
import { DESIG } from './common'

/**
 * The Collector's action queue. It lives here rather than in the page so the
 * navigation badge and the masthead bell can count the same list instead of
 * carrying a number that drifts away from it.
 */
export type Kind = 'sla' | 'court' | 'vip' | 'sign' | 'redflag'

export type Item = {
  id: string
  kind: Kind
  ref: string
  title: Bi
  detail: Bi
  owner: string
  designation: Bi
  phone: string
  deadline: Bi
  tone: 'good' | 'warning' | 'serious' | 'critical' | 'neutral' | 'info'
  cta: Bi
  ctaIcon: string
}

export const KIND_LABEL: Record<Kind, Bi> = {
  sla: bi('Overdue', 'காலம் தாண்டியவை'),
  court: bi('Court direction', 'நீதிமன்ற உத்தரவு'),
  vip: bi('VIP reference', 'முக்கிய பரிந்துரை'),
  sign: bi('Awaiting signature', 'கையொப்பம் நிலுவை'),
  redflag: bi('Red flag', 'சிவப்பு எச்சரிக்கை'),
}

export const KIND_ICON: Record<Kind, string> = {
  sla: 'timer_off',
  court: 'gavel',
  vip: 'star',
  sign: 'draw',
  redflag: 'flag',
}

export const ITEMS: Item[] = [
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
