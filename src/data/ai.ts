import { bi, type Bi } from '../i18n'
import type { SectionId } from '../app/sections'
import type { Tone } from '../components/ui/Primitives'

/**
 * Everything the AI Copilot knows, in one place.
 *
 * The module answers only from these records and from the same data files the
 * fifteen review pages render, so an answer can never quote a figure the rest
 * of the portal would disagree with. Nothing here calls out to a network:
 * retrieval, latency and streaming are modelled in src/ai/engine.ts.
 */

/* ------------------------------------------------------------------ *
 * Model card — shown in full on the Trust tab, and in short in the
 * composer, because an officer acting on a figure is entitled to know
 * what produced it.
 * ------------------------------------------------------------------ */

export const MODEL = {
  name: 'KGiri-Gov 2.4',
  family: bi('District governance model', 'மாவட்ட ஆளுமை மாதிரி'),
  host: bi('TN State Data Center, Chennai — on-premise', 'தமிழ்நாடு தரவு மையம், சென்னை — வளாகத்தினுள்'),
  context: bi('Krishnagiri district records only', 'கிருஷ்ணகிரி மாவட்டப் பதிவுகள் மட்டும்'),
  languages: bi('Tamil and English, question and answer', 'தமிழ் மற்றும் ஆங்கிலம், வினா மற்றும் விடை'),
  updated: bi('Index rebuilt 24 Oct 2024, 06:00 IST', 'குறியீடு புதுப்பிப்பு அக் 24, 2024, 06:00 IST'),
  residency: bi(
    'No record leaves the state data centre. No public model is called.',
    'எந்தப் பதிவும் மாநில தரவு மையத்தை விட்டு வெளியேறாது. பொது மாதிரி எதுவும் அழைக்கப்படுவதில்லை.',
  ),
}

export const GUARDRAILS: { icon: string; title: Bi; body: Bi }[] = [
  {
    icon: 'gavel',
    title: bi('It proposes, an officer commits', 'பரிந்துரைக்கும், அலுவலர் முடிவெடுப்பார்'),
    body: bi(
      'The Copilot cannot sanction, sign, transfer or issue anything. Every action button drafts the item and places it in your queue for signature.',
      'ஒப்புதல், கையொப்பம், மாற்றம் அல்லது உத்தரவு எதையும் இது வழங்க முடியாது. ஒவ்வொரு நடவடிக்கையும் வரைவாக உங்கள் பட்டியலில் கையொப்பத்திற்குச் சேர்க்கப்படும்.',
    ),
  },
  {
    icon: 'lock_person',
    title: bi('Answers are cut to your jurisdiction', 'உங்கள் அதிகார எல்லைக்கு மட்டும் பதில்'),
    body: bi(
      'A BDO asking a district question is answered for the block. The scope actually applied is named on every answer.',
      'ஒன்றிய அலுவலர் மாவட்ட வினா கேட்டால் ஒன்றியத்திற்கான பதில் மட்டும். பயன்படுத்தப்பட்ட எல்லை ஒவ்வொரு பதிலிலும் குறிக்கப்படும்.',
    ),
  },
  {
    icon: 'fact_check',
    title: bi('No figure without its source', 'மூலம் இல்லாமல் எந்த எண்ணும் இல்லை'),
    body: bi(
      'Every number carries the system it came from and the time it was read. If a feed is stale the answer says so instead of estimating.',
      'ஒவ்வொரு எண்ணும் அது வந்த அமைப்பையும் படித்த நேரத்தையும் சுமக்கும். தரவு பழையதாக இருந்தால் யூகிக்காமல் அதைச் சொல்லும்.',
    ),
  },
  {
    icon: 'person_off',
    title: bi('No personal data in prompts', 'வினாக்களில் தனிநபர் தரவு இல்லை'),
    body: bi(
      'Aadhaar, bank and phone fields are masked before retrieval. Petitioner names appear only inside the record they belong to.',
      'ஆதார், வங்கி, கைபேசி விவரங்கள் மறைக்கப்பட்டு பின் தேடல். மனுதாரர் பெயர் அந்தப் பதிவினுள் மட்டுமே தெரியும்.',
    ),
  },
  {
    icon: 'history_edu',
    title: bi('Every question is logged', 'ஒவ்வொரு வினாவும் பதிவாகும்'),
    body: bi(
      'Question, role, datasets touched, latency and outcome are written to the district audit log, retained for five years.',
      'வினா, பதவி, பயன்பட்ட தரவுத்தளங்கள், நேரம், விளைவு — மாவட்ட தணிக்கைப் பதிவேட்டில் ஐந்தாண்டு வரை பதிவு.',
    ),
  },
  {
    icon: 'warning',
    title: bi('Known limits', 'அறியப்பட்ட வரம்புகள்'),
    body: bi(
      'Projections assume no policy change. Village-level figures below 30 records are not projected. Court matters are summarised, never advised on.',
      'கணிப்புகள் கொள்கை மாற்றம் இல்லை என்று கருதுகின்றன. 30 பதிவுகளுக்கும் குறைவான கிராம அளவு தரவு கணிக்கப்படுவதில்லை. நீதிமன்ற விவகாரங்கள் சுருக்கம் மட்டும், ஆலோசனை அல்ல.',
    ),
  },
]

/* ------------------------------------------------------------------ *
 * Connected datasets — the scope chips under the composer.
 * ------------------------------------------------------------------ */

export type Dataset = {
  id: string
  label: Bi
  rows: string
  fresh: Bi
  tone: Tone
}

export const DATASETS: Dataset[] = [
  { id: 'star', label: bi('Star 2.0 land records', 'ஸ்டார் 2.0 நில பதிவு'), rows: '4.82 L', fresh: bi('4 min ago', '4 நிமிடம் முன்'), tone: 'good' },
  { id: 'cmcell', label: bi('CM Cell / CPGRAMS', 'முதல்வர் பிரிவு / மத்திய மனு'), rows: '1.28 L', fresh: bi('2 min ago', '2 நிமிடம் முன்'), tone: 'good' },
  { id: 'pfms', label: bi('PFMS / DBT', 'PFMS / நேரடி பயன்'), rows: '9.41 L', fresh: bi('11 min ago', '11 நிமிடம் முன்'), tone: 'good' },
  { id: 'ifhrms', label: bi('IFHRMS treasury', 'IFHRMS கருவூலம்'), rows: '62,400', fresh: bi('26 min ago', '26 நிமிடம் முன்'), tone: 'good' },
  { id: 'emis', label: bi('EMIS schools', 'EMIS பள்ளிகள்'), rows: '2,318', fresh: bi('1 h ago', '1 மணி முன்'), tone: 'good' },
  { id: 'health', label: bi('NCD / PICME health', 'சுகாதாரத் தரவு'), rows: '3.60 L', fresh: bi('18 min ago', '18 நிமிடம் முன்'), tone: 'good' },
  { id: 'wrd', label: bi('PWD WRD telemetry', 'நீர்வள தரவு'), rows: '1,104', fresh: bi('9 min ago', '9 நிமிடம் முன்'), tone: 'good' },
  { id: 'cctns', label: bi('CCTNS control room', 'காவல் தரவு மையம்'), rows: '47,900', fresh: bi('6 min ago', '6 நிமிடம் முன்'), tone: 'good' },
  { id: 'sipcot', label: bi('SIPCOT single window', 'சிப்காட் ஒற்றைச் சாளரம்'), rows: '812', fresh: bi('3 h ago', '3 மணி முன்'), tone: 'warning' },
]

/* ------------------------------------------------------------------ *
 * Prompt library — grouped the way the rail is grouped, so an officer
 * looks for a question where they would look for the module.
 * ------------------------------------------------------------------ */

export type PromptGroup = { label: Bi; icon: string; prompts: Bi[] }

export const PROMPT_LIBRARY: PromptGroup[] = [
  {
    label: bi('Start the day', 'நாளைத் தொடங்கு'),
    icon: 'wb_twilight',
    prompts: [
      bi('What needs my decision today?', 'இன்று என் முடிவு தேவைப்படுவது என்ன?'),
      bi('Brief me for the Chief Secretary video conference', 'தலைமைச் செயலாளர் காணொலிக் கூட்டத்திற்கு சுருக்கம் தா'),
      bi('Which deadlines will I breach this week?', 'இந்த வாரம் நான் தவறவிடப்போகும் காலக்கெடு எவை?'),
    ],
  },
  {
    label: bi('Public complaints', 'மக்கள் புகார்கள்'),
    icon: 'mark_email_unread',
    prompts: [
      bi('How many petitions are pending and where?', 'எத்தனை மனுக்கள் நிலுவை, எங்கே?'),
      bi('Which officer is sitting on the most overdue petitions?', 'அதிக காலம் கடந்த மனுக்களை வைத்திருப்பது யார்?'),
      bi('Why is the Berigai drinking water petition still open?', 'பேரிகை குடிநீர் மனு ஏன் இன்னும் நிலுவையில்?'),
      bi('Will we clear the CM Cell backlog by month end?', 'மாத இறுதிக்குள் முதல்வர் பிரிவு நிலுவை தீருமா?'),
    ],
  },
  {
    label: bi('Revenue & finance', 'வருவாய் & நிதி'),
    icon: 'real_estate_agent',
    prompts: [
      bi('Patta transfer pendency by taluk', 'வட்டம் வாரியாக பட்டா மாற்ற நிலுவை'),
      bi('Which departments are behind on budget utilisation?', 'நிதி பயன்பாட்டில் பின்தங்கிய துறைகள் எவை?'),
      bi('Compare Hosur and Krishnagiri taluks', 'ஓசூர் மற்றும் கிருஷ்ணகிரி வட்டங்களை ஒப்பிடு'),
    ],
  },
  {
    label: bi('Development', 'வளர்ச்சி'),
    icon: 'volunteer_activism',
    prompts: [
      bi('Show DBT failures and Aadhaar seeding gaps', 'நேரடி பயன் தோல்விகள் மற்றும் ஆதார் இணைப்பு இடைவெளி'),
      bi('Rainfall and reservoir storage against normal', 'மழை மற்றும் நீர்த்தேக்க இருப்பு இயல்பு நிலையுடன்'),
      bi('SIPCOT allotment and jobs pipeline', 'சிப்காட் ஒதுக்கீடு மற்றும் வேலைவாய்ப்பு'),
    ],
  },
  {
    label: bi('Human development & safety', 'மனித வளர்ச்சி & பாதுகாப்பு'),
    icon: 'local_hospital',
    prompts: [
      bi('Is fever surveillance showing an outbreak?', 'காய்ச்சல் கண்காணிப்பில் பரவல் தெரிகிறதா?'),
      bi('School dropout and breakfast scheme coverage', 'பள்ளி இடைநிற்றல் மற்றும் காலை உணவுத் திட்ட பயன்'),
      bi('Road safety on NH-44 this quarter', 'இந்த காலாண்டில் தே.நெ. 44 சாலைப் பாதுகாப்பு'),
    ],
  },
  {
    label: bi('Draft for me', 'எனக்காக வரைவு செய்'),
    icon: 'draw',
    prompts: [
      bi('Draft a show-cause notice for the Shoolagiri waste plant contractor', 'சூளகிரி கழிவு ஆலை ஒப்பந்ததாரருக்கு விளக்கம் கோரும் அறிவிப்பு வரைவு'),
      bi('Agenda for the weekly grievance review', 'வாராந்திர மனு ஆய்வுக் கூட்ட நிகழ்ச்சி நிரல்'),
      bi('Press note on the drinking water action taken', 'குடிநீர் நடவடிக்கை குறித்த செய்திக் குறிப்பு'),
    ],
  },
]

/** The four shown on an empty conversation. */
export const OPENING_PROMPTS: Bi[] = [
  bi('What needs my decision today?', 'இன்று என் முடிவு தேவைப்படுவது என்ன?'),
  bi('How many petitions are pending and where?', 'எத்தனை மனுக்கள் நிலுவை, எங்கே?'),
  bi('Which officer is sitting on the most overdue petitions?', 'அதிக காலம் கடந்த மனுக்களை வைத்திருப்பது யார்?'),
  bi('Will we clear the CM Cell backlog by month end?', 'மாத இறுதிக்குள் முதல்வர் பிரிவு நிலுவை தீருமா?'),
]

/* ------------------------------------------------------------------ *
 * Saved conversations. A thread is stored as the questions that were
 * asked; opening it replays them through the same engine, so a saved
 * transcript can never drift from what the engine answers today.
 * ------------------------------------------------------------------ */

export type Thread = {
  id: string
  title: Bi
  when: Bi
  prompts: Bi[]
  pinned?: boolean
}

export const THREADS: Thread[] = [
  {
    id: 't1',
    title: bi('Grievance day preparation', 'மனுநீதி நாள் தயாரிப்பு'),
    when: bi('Today 08:12', 'இன்று 08:12'),
    pinned: true,
    prompts: [
      bi('How many petitions are pending and where?', 'எத்தனை மனுக்கள் நிலுவை, எங்கே?'),
      bi('Which officer is sitting on the most overdue petitions?', 'அதிக காலம் கடந்த மனுக்களை வைத்திருப்பது யார்?'),
    ],
  },
  {
    id: 't2',
    title: bi('Berigai water escalation', 'பேரிகை குடிநீர் மேல்முறையீடு'),
    when: bi('Today 07:41', 'இன்று 07:41'),
    prompts: [
      bi('Why is the Berigai drinking water petition still open?', 'பேரிகை குடிநீர் மனு ஏன் இன்னும் நிலுவையில்?'),
    ],
  },
  {
    id: 't3',
    title: bi('Treasury and utilisation review', 'கருவூலம் மற்றும் நிதி பயன்பாட்டு ஆய்வு'),
    when: bi('Yesterday 17:20', 'நேற்று 17:20'),
    prompts: [
      bi('Which departments are behind on budget utilisation?', 'நிதி பயன்பாட்டில் பின்தங்கிய துறைகள் எவை?'),
    ],
  },
  {
    id: 't4',
    title: bi('DBT exception clean-up', 'நேரடி பயன் விலக்கு சரிசெய்தல்'),
    when: bi('Yesterday 11:05', 'நேற்று 11:05'),
    prompts: [
      bi('Show DBT failures and Aadhaar seeding gaps', 'நேரடி பயன் தோல்விகள் மற்றும் ஆதார் இணைப்பு இடைவெளி'),
    ],
  },
  {
    id: 't5',
    title: bi('Monsoon readiness', 'பருவமழை தயார்நிலை'),
    when: bi('22 Oct 16:48', 'அக் 22, 16:48'),
    prompts: [
      bi('Rainfall and reservoir storage against normal', 'மழை மற்றும் நீர்த்தேக்க இருப்பு இயல்பு நிலையுடன்'),
    ],
  },
  {
    id: 't6',
    title: bi('Fever surveillance check', 'காய்ச்சல் கண்காணிப்பு சோதனை'),
    when: bi('21 Oct 09:30', 'அக் 21, 09:30'),
    prompts: [
      bi('Is fever surveillance showing an outbreak?', 'காய்ச்சல் கண்காணிப்பில் பரவல் தெரிகிறதா?'),
    ],
  },
]

/* ------------------------------------------------------------------ *
 * The morning brief. Written at 06:00 off the overnight feeds; each
 * item names the module it was read out of.
 * ------------------------------------------------------------------ */

export type BriefItem = {
  id: string
  tone: Tone
  headline: Bi
  body: Bi
  metric: string
  metricLabel: Bi
  trend: number[]
  section: SectionId
  owner: Bi
  ask: Bi
}

export const BRIEF_GENERATED = bi('Generated 06:00 IST · 11 feeds · 4.2 s', 'உருவாக்கம் 06:00 IST · 11 தரவு · 4.2 வி')

export const BRIEFING: BriefItem[] = [
  {
    id: 'b1',
    tone: 'critical',
    headline: bi('Berigai drinking water is now the district’s oldest open petition', 'பேரிகை குடிநீர் — மாவட்டத்தின் மிகப் பழைய நிலுவை மனு'),
    body: bi(
      'CM/KRI/88214 crossed 68 days overnight, 38 days past the 30-day norm. Tanker supply is running but the permanent scheme file has not moved for 21 days. Three more Berigai petitions arrived this week, which is how a single village becomes a district-level question.',
      'CM/KRI/88214 இரவோடு 68 நாட்களைக் கடந்தது — 30 நாள் வரம்பை விட 38 நாட்கள் அதிகம். தொட்டி லாரி விநியோகம் நடக்கிறது, ஆனால் நிரந்தரத் திட்டக் கோப்பு 21 நாட்களாக நகரவில்லை. இந்த வாரம் பேரிகையிலிருந்து மேலும் மூன்று மனுக்கள்.',
    ),
    metric: '68',
    metricLabel: bi('days open', 'நாட்கள் நிலுவை'),
    trend: [41, 46, 51, 55, 59, 63, 68],
    section: 'grievances',
    owner: bi('BDO Shoolagiri · S. Manivannan', 'ஒன்றிய அலுவலர், சூளகிரி · எஸ். மணிவண்ணன்'),
    ask: bi('Fix a dated milestone in today’s review', 'இன்றைய ஆய்வில் தேதியுடன் இலக்கு நிர்ணயிக்க'),
  },
  {
    id: 'b2',
    tone: 'critical',
    headline: bi('Counter affidavit in WP 2841/24 is due tomorrow', 'WP 2841/24 எதிர் பிரமாணப் பத்திரம் நாளை'),
    body: bi(
      'The Government Pleader has vetted the draft on the Shoolagiri Periya Eri encroachment; the bench hears it in 48 hours. Only your approval is outstanding. Two other matters — WP 3190/24 and CONT 44/24 — fall due inside nine days.',
      'சூளகிரி பெரிய ஏரி ஆக்கிரமிப்பு தொடர்பான வரைவை அரசு வழக்கறிஞர் சரிபார்த்துவிட்டார்; 48 மணி நேரத்தில் விசாரணை. உங்கள் ஒப்புதல் மட்டும் நிலுவை. WP 3190/24, CONT 44/24 ஆகியவை ஒன்பது நாட்களுக்குள்.',
    ),
    metric: '1',
    metricLabel: bi('day left', 'நாள் மட்டும்'),
    trend: [7, 6, 5, 4, 3, 2, 1],
    section: 'actions',
    owner: bi('Tahsildar Shoolagiri · P. Devi', 'வட்டாட்சியர், சூளகிரி · பி. தேவி'),
    ask: bi('Approve the e-draft before 18:00', '18:00 மணிக்கு முன் மின் வரைவை ஒப்புதல்'),
  },
  {
    id: 'b3',
    tone: 'serious',
    headline: bi('2,140 PM-KISAN records will miss the payment cycle in six days', '2,140 பிரதமர் கிசான் பதிவுகள் ஆறு நாட்களில் பணச் சுழற்சியை இழக்கும்'),
    body: bi(
      'Aadhaar seeding is incomplete in Uthangarai block. At the present camp rate of 180 records a day the block clears 1,080 — half the list. Two additional camps a day closes the gap with a day to spare.',
      'ஊத்தங்கரை ஒன்றியத்தில் ஆதார் இணைப்பு முடியவில்லை. நாளொன்றுக்கு 180 பதிவுகள் என்ற தற்போதைய வேகத்தில் 1,080 மட்டுமே முடியும் — பட்டியலில் பாதி. நாளொன்றுக்கு இரண்டு கூடுதல் முகாம்கள் இடைவெளியை ஒரு நாள் முன்னதாகவே நிரப்பும்.',
    ),
    metric: '2,140',
    metricLabel: bi('records blocked', 'தடைபட்ட பதிவுகள்'),
    trend: [2680, 2590, 2470, 2380, 2300, 2210, 2140],
    section: 'schemes',
    owner: bi('BDO Uthangarai', 'ஒன்றிய அலுவலர், ஊத்தங்கரை'),
    ask: bi('Order two extra seeding camps a day', 'நாளொன்றுக்கு இரு கூடுதல் முகாம் உத்தரவு'),
  },
  {
    id: 'b4',
    tone: 'warning',
    headline: bi('Fever cases in Thally and Denkanikottai are above the seasonal band', 'தளி, தேன்கனிக்கோட்டையில் காய்ச்சல் பாதிப்பு பருவகால வரம்பை மீறியுள்ளது'),
    body: bi(
      'Outpatient fever reporting rose for the fourth consecutive week, 2.1× the three-year average for late October. No dengue mortality. Vector control has covered 61% of the flagged habitations.',
      'வெளிநோயாளி காய்ச்சல் பதிவு தொடர்ந்து நான்காவது வாரமும் உயர்ந்தது — அக்டோபர் இறுதிக்கான மூன்றாண்டு சராசரியில் 2.1 மடங்கு. டெங்கு உயிரிழப்பு இல்லை. குறிக்கப்பட்ட குடியிருப்புகளில் 61% கொசு ஒழிப்பு முடிந்தது.',
    ),
    metric: '2.1×',
    metricLabel: bi('vs seasonal normal', 'பருவகால இயல்பு ஒப்பீடு'),
    trend: [118, 126, 141, 168, 199, 232, 268],
    section: 'health',
    owner: bi('Joint Director, Health', 'இணை இயக்குநர், சுகாதாரம்'),
    ask: bi('Close vector control to 100% in three days', 'மூன்று நாட்களில் கொசு ஒழிப்பை 100% முடிக்க'),
  },
  {
    id: 'b5',
    tone: 'good',
    headline: bi('Breakfast scheme and patta disposal both cleared their October targets', 'காலை உணவுத் திட்டம் மற்றும் பட்டா தீர்வு — அக்டோபர் இலக்கு எட்டப்பட்டது'),
    body: bi(
      'Breakfast coverage held at 97.4% across 1,182 schools for the third week. Patta disposal closed 3,410 files against a 3,200 target, the first month this year the district cleared more than it received.',
      '1,182 பள்ளிகளில் காலை உணவுப் பயன் மூன்றாவது வாரமும் 97.4% ஆக நிலைத்தது. பட்டா தீர்வில் 3,200 இலக்குக்கு எதிராக 3,410 கோப்புகள் முடிக்கப்பட்டன — இந்த ஆண்டில் பெற்றதை விட அதிகம் முடித்த முதல் மாதம்.',
    ),
    metric: '106%',
    metricLabel: bi('of October target', 'அக்டோபர் இலக்கில்'),
    trend: [88, 91, 93, 96, 99, 103, 106],
    section: 'revenue',
    owner: bi('District Revenue Officer', 'மாவட்ட வருவாய் அலுவலர்'),
    ask: bi('Record the two Tahsildars in the review minutes', 'ஆய்வுக் குறிப்பில் இரு வட்டாட்சியர்களைப் பதிவு செய்ய'),
  },
]

/* ------------------------------------------------------------------ *
 * Signals — what the anomaly pass found overnight. A signal is a
 * measured deviation from a stated baseline, never a hunch.
 * ------------------------------------------------------------------ */

export type Signal = {
  id: string
  tone: Tone
  title: Bi
  where: Bi
  baseline: Bi
  observed: Bi
  deviation: string
  sigma: number
  window: number[]
  reading: Bi
  section: SectionId
  confidence: number
}

export const SIGNALS: Signal[] = [
  {
    id: 's1',
    tone: 'critical',
    title: bi('Water complaints clustering in one panchayat', 'ஒரே ஊராட்சியில் குடிநீர் புகார் குவிதல்'),
    where: bi('Berigai, Shoolagiri block', 'பேரிகை, சூளகிரி ஒன்றியம்'),
    baseline: bi('1.2 complaints / week (30-day mean)', 'வாரம் 1.2 புகார் (30 நாள் சராசரி)'),
    observed: bi('7 complaints this week', 'இந்த வாரம் 7 புகார்'),
    deviation: '5.8×',
    sigma: 3.4,
    window: [1, 2, 1, 2, 3, 5, 7],
    reading: bi(
      'Seven petitions from 4 habitations, all naming the same overhead tank. Reads as one asset failure, not seven grievances.',
      '4 குடியிருப்புகளிலிருந்து ஏழு மனுக்கள், அனைத்தும் ஒரே மேல்நிலைத் தொட்டியைக் குறிக்கின்றன. ஏழு புகார்கள் அல்ல — ஒரு சொத்துக் கோளாறு.',
    ),
    section: 'grievances',
    confidence: 0.94,
  },
  {
    id: 's2',
    tone: 'serious',
    title: bi('Patta files re-opening after disposal', 'தீர்வுக்குப் பின் பட்டா கோப்புகள் மீண்டும் திறப்பு'),
    where: bi('Denkanikottai taluk', 'தேன்கனிக்கோட்டை வட்டம்'),
    baseline: bi('3.1% re-open rate (district)', 'மாவட்ட மீள்திறப்பு விகிதம் 3.1%'),
    observed: bi('11.4% re-open rate', 'மீள்திறப்பு விகிதம் 11.4%'),
    deviation: '3.7×',
    sigma: 2.9,
    window: [3, 4, 4, 6, 8, 10, 11],
    reading: bi(
      'Disposals are being recorded before the FMB sketch is attached, so the petitioner returns. A disposal that comes back is worse than a pendency.',
      'FMB வரைபடம் இணைக்கும் முன்பே தீர்வு பதிவாகிறது, எனவே மனுதாரர் திரும்புகிறார். திரும்பி வரும் தீர்வு நிலுவையை விடக் கெட்டது.',
    ),
    section: 'revenue',
    confidence: 0.88,
  },
  {
    id: 's3',
    tone: 'serious',
    title: bi('Treasury bills bunching at month end', 'மாத இறுதியில் கருவூல மசோதாக்கள் குவிதல்'),
    where: bi('Six departments', 'ஆறு துறைகள்'),
    baseline: bi('34% of bills in the last week', 'கடைசி வாரத்தில் 34% மசோதா'),
    observed: bi('71% of bills in the last week', 'கடைசி வாரத்தில் 71% மசோதா'),
    deviation: '2.1×',
    sigma: 2.6,
    window: [36, 38, 41, 49, 58, 65, 71],
    reading: bi(
      'March-rush behaviour appearing in October. Bunched bills are the usual precursor to lapsed allotment and audit paras.',
      'மார்ச் மாதப் பழக்கம் அக்டோபரில் தெரிகிறது. குவிந்த மசோதாக்கள் நிதி காலாவதி மற்றும் தணிக்கை பாராக்களுக்கு முன்னோடி.',
    ),
    section: 'finance',
    confidence: 0.81,
  },
  {
    id: 's4',
    tone: 'warning',
    title: bi('Biometric attendance falling on Wednesdays', 'புதன்கிழமைகளில் பயோமெட்ரிக் வருகை சரிவு'),
    where: bi('14 PHCs and 9 VAO offices', '14 ஆரம்ப சுகாதார நிலையங்கள், 9 கிராம நிர்வாக அலுவலகங்கள்'),
    baseline: bi('91.2% weekly mean', 'வாராந்திர சராசரி 91.2%'),
    observed: bi('78.6% on Wednesdays', 'புதன்கிழமை 78.6%'),
    deviation: '−12.6 pt',
    sigma: 2.2,
    window: [90, 88, 84, 82, 80, 79, 79],
    reading: bi(
      'The dip lines up with the block review calendar. Either the reviews are pulling staff off station or the punch is being skipped.',
      'இந்த சரிவு ஒன்றிய ஆய்வு நாட்காட்டியுடன் பொருந்துகிறது. ஆய்வுகள் பணியாளர்களை வெளியே இழுக்கின்றன அல்லது வருகைப் பதிவு தவிர்க்கப்படுகிறது.',
    ),
    section: 'hr',
    confidence: 0.76,
  },
  {
    id: 's5',
    tone: 'warning',
    title: bi('Night accidents rising on the NH-44 Hosur stretch', 'தே.நெ. 44 ஓசூர் பகுதியில் இரவு விபத்து அதிகரிப்பு'),
    where: bi('km 41–58, Hosur–Krishnagiri', 'கி.மீ 41–58, ஓசூர்–கிருஷ்ணகிரி'),
    baseline: bi('4.2 night accidents / month', 'மாதம் 4.2 இரவு விபத்து'),
    observed: bi('9 in the last 30 days', 'கடந்த 30 நாட்களில் 9'),
    deviation: '2.1×',
    sigma: 2.4,
    window: [4, 3, 5, 6, 7, 8, 9],
    reading: bi(
      'Eight of nine fall between 21:00 and 02:00 within 3 km of two unlit median cuts opened for the service road work.',
      'ஒன்பதில் எட்டு 21:00–02:00 இடையே, சேவைச் சாலைப் பணிக்காகத் திறக்கப்பட்ட இரு விளக்கில்லா இடைவெளிகளுக்கு 3 கி.மீ தொலைவினுள்.',
    ),
    section: 'lawOrder',
    confidence: 0.85,
  },
]

/* ------------------------------------------------------------------ *
 * Forecasts. Each one states its method and its own back-test error,
 * because a projection an officer cannot audit is not usable.
 * ------------------------------------------------------------------ */

export type Forecast = {
  id: string
  title: Bi
  question: Bi
  labels: Bi[]
  actual: number[]
  projected: number[]
  band: { upper: number[]; lower: number[] }
  /** Index at which recorded figures end and the projection begins. */
  splitAt: number
  unit: string
  method: Bi
  backtest: Bi
  verdict: { tone: Tone; label: Bi; body: Bi }
  scenarios: { label: Bi; lever: Bi; result: Bi; tone: Tone }[]
  section: SectionId
}

const W = (values: string[]) => values.map((value) => bi(value, value))

export const FORECASTS: Forecast[] = [
  {
    id: 'f1',
    title: bi('CM Cell backlog to 30 November', 'முதல்வர் பிரிவு நிலுவை — நவம்பர் 30 வரை'),
    question: bi('Will we clear the CM Cell backlog by month end?', 'மாத இறுதிக்குள் முதல்வர் பிரிவு நிலுவை தீருமா?'),
    labels: W(['W-6', 'W-5', 'W-4', 'W-3', 'W-2', 'W-1', 'Now', 'W+1', 'W+2', 'W+3', 'W+4']),
    actual: [412, 396, 388, 371, 352, 341, 328, 312, 298, 287, 279],
    projected: [],
    band: {
      upper: [412, 396, 388, 371, 352, 341, 328, 331, 336, 344, 352],
      lower: [412, 396, 388, 371, 352, 341, 328, 293, 262, 235, 211],
    },
    splitAt: 6,
    unit: '',
    method: bi(
      'Weekly arrival and disposal rates, 18-week window, Holt linear trend with the Grievance Day disposal spike held out.',
      'வாராந்திர வரவு மற்றும் தீர்வு விகிதம், 18 வார சாளரம், மனுநீதி நாள் உச்சம் நீக்கிய ஹோல்ட் நேரியல் போக்கு.',
    ),
    backtest: bi('Mean error 4.6% over the last 8 weeks', 'கடந்த 8 வாரங்களில் சராசரி பிழை 4.6%'),
    verdict: {
      tone: 'warning',
      label: bi('Not at the present rate', 'தற்போதைய வேகத்தில் இல்லை'),
      body: bi(
        'The trend lands at 279 open petitions on 30 November, not zero. Disposal is 41 a week against 28 arrivals, so the backlog falls, but 279 of it is older than 45 days and clearing that needs a camp, not a faster queue.',
        'இந்தப் போக்கு நவம்பர் 30-இல் 279 நிலுவை மனுக்களில் நிற்கிறது, பூஜ்யத்தில் அல்ல. வாரம் 28 வரவுக்கு எதிராக 41 தீர்வு, எனவே நிலுவை குறைகிறது; ஆனால் அதில் 279 மனுக்கள் 45 நாட்களுக்கு மேல் பழையவை — வேகமான வரிசை அல்ல, முகாம் தேவை.',
      ),
    },
    scenarios: [
      { label: bi('No change', 'மாற்றம் இல்லை'), lever: bi('41 disposals / week', 'வாரம் 41 தீர்வு'), result: bi('279 open on 30 Nov', 'நவ 30-இல் 279 நிலுவை'), tone: 'warning' },
      { label: bi('Two special camps', 'இரு சிறப்பு முகாம்'), lever: bi('+120 disposals', '+120 தீர்வு'), result: bi('159 open on 30 Nov', 'நவ 30-இல் 159 நிலுவை'), tone: 'good' },
      { label: bi('Officer-wise deadline', 'அலுவலர் வாரியாக காலக்கெடு'), lever: bi('45-day cap enforced', '45 நாள் வரம்பு அமல்'), result: bi('0 above 45 days', '45 நாட்களுக்கு மேல் 0'), tone: 'good' },
      { label: bi('Arrivals rise 20%', 'வரவு 20% உயர்வு'), lever: bi('Grievance Day surge', 'மனுநீதி நாள் அதிகரிப்பு'), result: bi('344 open on 30 Nov', 'நவ 30-இல் 344 நிலுவை'), tone: 'critical' },
    ],
    section: 'grievances',
  },
  {
    id: 'f2',
    title: bi('Fever caseload, next four weeks', 'காய்ச்சல் பாதிப்பு — அடுத்த நான்கு வாரம்'),
    question: bi('Is fever surveillance showing an outbreak?', 'காய்ச்சல் கண்காணிப்பில் பரவல் தெரிகிறதா?'),
    labels: W(['Sep W2', 'Sep W3', 'Sep W4', 'Oct W1', 'Oct W2', 'Oct W3', 'Now', 'Nov W1', 'Nov W2', 'Nov W3']),
    actual: [118, 126, 141, 168, 199, 232, 268, 291, 296, 274],
    projected: [],
    band: {
      upper: [118, 126, 141, 168, 199, 232, 268, 318, 348, 341],
      lower: [118, 126, 141, 168, 199, 232, 268, 264, 244, 207],
    },
    splitAt: 6,
    unit: '',
    method: bi(
      'Outpatient fever reporting from 62 institutions, negative-binomial regression on rainfall lag of 9 days.',
      '62 நிறுவனங்களின் வெளிநோயாளி காய்ச்சல் பதிவு, 9 நாள் மழை இடைவெளியில் நெகட்டிவ்-பைனோமியல் பின்னடைவு.',
    ),
    backtest: bi('Mean error 7.9% over the last 6 weeks', 'கடந்த 6 வாரங்களில் சராசரி பிழை 7.9%'),
    verdict: {
      tone: 'serious',
      label: bi('Peak expected in 12–16 days', '12–16 நாட்களில் உச்சம் எதிர்பார்ப்பு'),
      body: bi(
        'The curve is still climbing but the rate of climb has halved since Oct W2, which is what a peak looks like before it turns. Thally and Denkanikottai carry 46% of the load on 21% of the population.',
        'வளைவு இன்னும் உயர்கிறது, ஆனால் அக்டோபர் W2-இலிருந்து உயர்வு வேகம் பாதியாகக் குறைந்தது — உச்சம் திரும்புவதற்கு முன் தோன்றும் அமைப்பு. மக்கள்தொகையில் 21% கொண்ட தளி, தேன்கனிக்கோட்டை பாதிப்பில் 46% சுமக்கின்றன.',
      ),
    },
    scenarios: [
      { label: bi('Vector control at 61%', 'கொசு ஒழிப்பு 61%'), lever: bi('Current pace', 'தற்போதைய வேகம்'), result: bi('Peak 296 in Nov W2', 'நவ W2-இல் உச்சம் 296'), tone: 'serious' },
      { label: bi('Full coverage in 3 days', '3 நாட்களில் முழு பயன்'), lever: bi('+8 spray teams', '+8 தெளிப்பு குழு'), result: bi('Peak 241, 9 days earlier', 'உச்சம் 241, 9 நாள் முன்னதாக'), tone: 'good' },
      { label: bi('Fever camps in 2 blocks', '2 ஒன்றியங்களில் காய்ச்சல் முகாம்'), lever: bi('Early detection', 'முன் கண்டறிதல்'), result: bi('Admissions −22%', 'உள்நோயாளி −22%'), tone: 'good' },
    ],
    section: 'health',
  },
  {
    id: 'f3',
    title: bi('Reservoir storage to end of season', 'பருவ முடிவு வரை நீர்த்தேக்க இருப்பு'),
    question: bi('Rainfall and reservoir storage against normal', 'மழை மற்றும் நீர்த்தேக்க இருப்பு இயல்பு நிலையுடன்'),
    labels: W(['Aug', 'Sep W2', 'Sep W4', 'Oct W1', 'Oct W2', 'Oct W3', 'Now', 'Nov', 'Dec', 'Jan']),
    actual: [38, 44, 51, 58, 64, 69, 72, 78, 81, 74],
    projected: [],
    band: {
      upper: [38, 44, 51, 58, 64, 69, 72, 86, 94, 91],
      lower: [38, 44, 51, 58, 64, 69, 72, 70, 68, 57],
    },
    splitAt: 6,
    unit: '%',
    method: bi(
      'Krishnagiri, Kelavarapalli and Barur storage against the 10-year median inflow for a north-east monsoon at 108% of normal.',
      'இயல்பில் 108% வடகிழக்குப் பருவமழைக்கான 10 ஆண்டு இடைநிலை நீர்வரத்துடன் கிருஷ்ணகிரி, கேளவரப்பள்ளி, பர்கூர் இருப்பு ஒப்பீடு.',
    ),
    backtest: bi('Mean error 5.2% over three seasons', 'மூன்று பருவங்களில் சராசரி பிழை 5.2%'),
    verdict: {
      tone: 'good',
      label: bi('Drinking water secured to March', 'மார்ச் வரை குடிநீர் உறுதி'),
      body: bi(
        'Storage reaches 81% by December against a 68% ten-year median. Drinking water for the two municipalities is covered to March even on the lower band; the risk is not supply but the 41 habitations still on tanker because of a broken asset.',
        'டிசம்பரில் இருப்பு 81% எட்டும் — 10 ஆண்டு இடைநிலை 68%. கீழ் வரம்பிலும் இரு நகராட்சிகளுக்கும் மார்ச் வரை குடிநீர் உறுதி; ஆபத்து விநியோகம் அல்ல, சொத்துக் கோளாறு காரணமாக இன்னும் தொட்டி லாரியில் உள்ள 41 குடியிருப்புகள்.',
      ),
    },
    scenarios: [
      { label: bi('Monsoon at normal', 'இயல்பு பருவமழை'), lever: bi('108% of normal', 'இயல்பில் 108%'), result: bi('81% by December', 'டிசம்பரில் 81%'), tone: 'good' },
      { label: bi('Deficit monsoon', 'பருவமழை பாதிப்பு'), lever: bi('75% of normal', 'இயல்பில் 75%'), result: bi('68% by December', 'டிசம்பரில் 68%'), tone: 'warning' },
      { label: bi('Tanker habitations fixed', 'தொட்டி லாரி குடியிருப்புகள் சரி'), lever: bi('41 assets repaired', '41 சொத்து பழுது நீக்கம்'), result: bi('Tanker cost −₹34 L / month', 'லாரி செலவு −₹34 லட்சம் / மாதம்'), tone: 'good' },
    ],
    section: 'agriculture',
  },
]

/* ------------------------------------------------------------------ *
 * Drafting studio. The Copilot writes the first version of the paper an
 * officer would otherwise dictate; the officer edits and signs it.
 * ------------------------------------------------------------------ */

export type DraftTemplate = {
  id: string
  icon: string
  title: Bi
  note: Bi
  /** Reference the draft is built from, shown as a chip. */
  basis: Bi
  meta: Bi
  paragraphs: Bi[]
}

export const DRAFTS: DraftTemplate[] = [
  {
    id: 'd1',
    icon: 'description',
    title: bi('Show-cause notice — contractor', 'விளக்கம் கோரும் அறிவிப்பு — ஒப்பந்ததாரர்'),
    note: bi('Shoolagiri solid waste plant, 19% complete in 14 months', 'சூளகிரி திடக்கழிவு ஆலை, 14 மாதங்களில் 19%'),
    basis: bi('INFRA/SW/04 · ₹8.9 Cr', 'INFRA/SW/04 · ₹8.9 கோடி'),
    meta: bi('Drafted for the Collector’s signature · 412 words', 'ஆட்சியர் கையொப்பத்திற்கான வரைவு · 412 சொற்கள்'),
    paragraphs: [
      bi(
        'Sub: Solid waste processing facility, Shoolagiri town panchayat — work no. INFRA/SW/04 — abnormal delay in execution — show cause called for.',
        'பொருள்: சூளகிரி பேரூராட்சி திடக்கழிவு மேலாண்மை வசதி — பணி எண். INFRA/SW/04 — பணி நிறைவேற்றத்தில் அசாதாரண தாமதம் — விளக்கம் கோரப்படுகிறது.',
      ),
      bi(
        'Ref: 1. Agreement no. 214/SWM/2023 dated 12 August 2023. 2. Site inspection report of the Executive Engineer dated 19 October 2024. 3. Minutes of the District Level Review Committee dated 08 October 2024.',
        'பார்வை: 1. 12 ஆகஸ்ட் 2023 நாளிட்ட ஒப்பந்தம் எண். 214/SWM/2023. 2. 19 அக்டோபர் 2024 நாளிட்ட செயற்பொறியாளர் கள ஆய்வு அறிக்கை. 3. 08 அக்டோபர் 2024 நாளிட்ட மாவட்ட அளவு ஆய்வுக் குழு நடவடிக்கைக் குறிப்பு.',
      ),
      bi(
        'The agreement cited above provided for completion of the facility within twelve months from the date of handing over of the site, that is, by 11 August 2024. Against a contract value of ₹8.90 crore, physical progress recorded at the inspection of 19 October 2024 is 19%, with fourteen months elapsed. Payments of ₹1.72 crore have been released against measured work.',
        'மேற்படி ஒப்பந்தம், இடம் ஒப்படைக்கப்பட்ட நாளிலிருந்து பன்னிரண்டு மாதங்களுக்குள், அதாவது 11 ஆகஸ்ட் 2024-க்குள் பணியை நிறைவு செய்ய வழிவகை செய்தது. ₹8.90 கோடி ஒப்பந்த மதிப்புக்கு எதிராக, 19 அக்டோபர் 2024 ஆய்வில் பதிவான இயற்பியல் முன்னேற்றம் 19% மட்டுமே; பதினான்கு மாதங்கள் கடந்துவிட்டன. அளவிடப்பட்ட பணிக்கு ₹1.72 கோடி வழங்கப்பட்டுள்ளது.',
      ),
      bi(
        'No extension of time has been applied for under clause 14 of the agreement, and no force majeure event has been reported. The delay has consequently held up the closure of the open dump site at Shoolagiri, which is the subject of two petitions before this office and of a direction of the District Environmental Engineer dated 02 September 2024.',
        'ஒப்பந்தத்தின் பிரிவு 14-இன் கீழ் கால நீட்டிப்புக்கு விண்ணப்பம் எதுவும் இல்லை; தவிர்க்க இயலாத காரணம் எதுவும் தெரிவிக்கப்படவில்லை. இதன் விளைவாக சூளகிரி திறந்த கழிவுக் குவியல் மூடப்படுவது நிறுத்தப்பட்டுள்ளது — இது இந்த அலுவலகத்தில் உள்ள இரு மனுக்களுக்கும், 02 செப்டம்பர் 2024 நாளிட்ட மாவட்ட சுற்றுச்சூழல் பொறியாளரின் உத்தரவுக்கும் உரிய பொருள்.',
      ),
      bi(
        'You are therefore called upon to show cause, within seven days of receipt of this notice, why action should not be taken under clause 21 of the agreement for termination at your risk and cost, along with forfeiture of the performance security and blacklisting for a period of three years. Your reply shall be accompanied by a bar chart of remaining activities with dated milestones.',
        'எனவே, இந்த அறிவிப்பைப் பெற்ற ஏழு நாட்களுக்குள், ஒப்பந்தத்தின் பிரிவு 21-இன் கீழ் உங்கள் இடர் மற்றும் செலவில் ஒப்பந்தம் ரத்து செய்தல், செயல்திறன் வைப்புத்தொகை பறிமுதல் மற்றும் மூன்று ஆண்டுகளுக்கு தடைப்பட்டியலில் சேர்த்தல் ஆகிய நடவடிக்கைகள் எடுக்கக் கூடாது என்பதற்கான விளக்கம் அளிக்கக் கோரப்படுகிறீர்கள். உங்கள் பதிலுடன், மீதமுள்ள பணிகளுக்கான தேதியிட்ட இலக்குகள் கொண்ட பட்டை வரைபடம் இணைக்கப்பட வேண்டும்.',
      ),
      bi(
        'Failure to reply within the stipulated period will be taken as having no explanation to offer, and action will follow on the record as it stands.',
        'குறிப்பிட்ட காலத்திற்குள் பதில் அளிக்கத் தவறினால், அளிக்க விளக்கம் இல்லை என்று கருதப்பட்டு, உள்ள பதிவுகளின் அடிப்படையில் நடவடிக்கை தொடரும்.',
      ),
    ],
  },
  {
    id: 'd2',
    icon: 'gavel',
    title: bi('Counter affidavit — points for the Government Pleader', 'எதிர் பிரமாணப் பத்திரம் — அரசு வழக்கறிஞருக்கான குறிப்புகள்'),
    note: bi('WP 2841/24 — Shoolagiri Periya Eri encroachment', 'WP 2841/24 — சூளகிரி பெரிய ஏரி ஆக்கிரமிப்பு'),
    basis: bi('WP 2841/24 · hearing in 48 h', 'WP 2841/24 · 48 மணியில் விசாரணை'),
    meta: bi('Facts only. No legal opinion is offered. · 6 points', 'உண்மைகள் மட்டும். சட்ட ஆலோசனை அல்ல. · 6 குறிப்புகள்'),
    paragraphs: [
      bi(
        '1. Extent and classification: Survey no. 214/2A, 214/2B of Shoolagiri village, classified as Government poramboke — water course, extent 4.62 hectares, as per the Settlement Register and the FMB sketch of 1976.',
        '1. பரப்பு மற்றும் வகைப்பாடு: சூளகிரி கிராமம் புல எண். 214/2A, 214/2B, அரசு புறம்போக்கு — நீர்வழி என வகைப்படுத்தப்பட்டது, பரப்பு 4.62 ஹெக்டேர், 1976 நிலவரித் திட்ட பதிவேடு மற்றும் FMB வரைபடத்தின்படி.',
      ),
      bi(
        '2. Nature of the encroachment: 14 structures, of which 9 are thatched and 5 are masonry, occupying 0.81 hectare on the northern bund. Encroachment first recorded in the Village Account no. 8 in 2019.',
        '2. ஆக்கிரமிப்பின் தன்மை: 14 கட்டமைப்புகள் — 9 கூரை, 5 கல் கட்டுமானம் — வடக்கு கரையில் 0.81 ஹெக்டேரை ஆக்கிரமித்துள்ளன. ஆக்கிரமிப்பு முதன்முதலில் 2019-இல் கிராமக் கணக்கு எண். 8-இல் பதிவானது.',
      ),
      bi(
        '3. Action already taken: Notices under section 7 of the Tamil Nadu Land Encroachment Act, 1905 served on all 14 occupants on 14 March 2024. Eviction of 6 thatched structures effected on 21 June 2024. Balance 8 pending on account of the interim order of this Hon’ble Court dated 09 July 2024.',
        '3. ஏற்கனவே எடுக்கப்பட்ட நடவடிக்கை: தமிழ்நாடு நில ஆக்கிரமிப்புச் சட்டம், 1905-இன் பிரிவு 7-இன் கீழ் அறிவிப்புகள் 14 குடியிருப்போர் அனைவருக்கும் 14 மார்ச் 2024-இல் வழங்கப்பட்டன. 6 கூரை கட்டமைப்புகள் 21 ஜூன் 2024-இல் அகற்றப்பட்டன. மீதமுள்ள 8, 09 ஜூலை 2024 நாளிட்ட இந்த நீதிமன்ற இடைக்கால உத்தரவின் காரணமாக நிலுவையில்.',
      ),
      bi(
        '4. Rehabilitation: 8 families found eligible under the district housing scheme; house sites of 1.5 cents each identified in Survey no. 302/1 at a distance of 1.2 km. Allotment orders drafted and awaiting the outcome of this writ.',
        '4. மறுவாழ்வு: 8 குடும்பங்கள் மாவட்ட வீட்டுவசதித் திட்டத்தின் கீழ் தகுதி பெற்றுள்ளன; தலா 1.5 சென்ட் வீட்டுமனைகள் 1.2 கி.மீ தொலைவில் புல எண். 302/1-இல் அடையாளம் காணப்பட்டுள்ளன. ஒதுக்கீட்டு உத்தரவுகள் வரைவாகி, இந்த மனுவின் முடிவுக்குக் காத்திருக்கின்றன.',
      ),
      bi(
        '5. Public interest: The tank irrigates 214 acres in Shoolagiri and Berigai and is the recharge source for 9 drinking water wells. Storage lost to the encroached bund is assessed at 0.21 mcft.',
        '5. பொது நலன்: இந்த ஏரி சூளகிரி மற்றும் பேரிகையில் 214 ஏக்கருக்கு நீர்ப்பாசனம் அளிக்கிறது; 9 குடிநீர் கிணறுகளுக்கு நீர் ஊட்ட மூலமாக உள்ளது. ஆக்கிரமிக்கப்பட்ட கரை காரணமாக இழந்த இருப்பு 0.21 மில்லியன் கன அடி என மதிப்பிடப்பட்டுள்ளது.',
      ),
      bi(
        '6. Documents to be enclosed: Settlement Register extract, FMB sketch, Village Account no. 8, section 7 notices with acknowledgements, eviction proceedings of 21 June 2024, WRD assessment of storage loss, and the draft allotment orders.',
        '6. இணைக்க வேண்டிய ஆவணங்கள்: நிலவரித் திட்ட பதிவேட்டுப் பிரதி, FMB வரைபடம், கிராமக் கணக்கு எண். 8, ஒப்புகைச் சீட்டுடன் பிரிவு 7 அறிவிப்புகள், 21 ஜூன் 2024 அகற்றல் நடவடிக்கை, நீர்வளத் துறை இருப்பு இழப்பு மதிப்பீடு, வரைவு ஒதுக்கீட்டு உத்தரவுகள்.',
      ),
    ],
  },
  {
    id: 'd3',
    icon: 'co_present',
    title: bi('Talking points — Chief Secretary video conference', 'பேசுபொருள் — தலைமைச் செயலாளர் காணொலிக் கூட்டம்'),
    note: bi('Jal Jeevan Mission and Breakfast Scheme Phase-II', 'ஜல் ஜீவன் திட்டம் மற்றும் காலை உணவுத் திட்டம் கட்டம்-II'),
    basis: bi('Today 14:30 · 8 minutes', 'இன்று 14:30 · 8 நிமிடம்'),
    meta: bi('Eight minutes at a normal reading pace · 5 points', 'இயல்பு வேகத்தில் எட்டு நிமிடம் · 5 குறிப்புகள்'),
    paragraphs: [
      bi(
        'Position on Jal Jeevan Mission: 412 of 486 habitations have functional household tap connections, 84.8%, against a state average of 81.2%. The 74 remaining are in Thally and Denkanikottai, where the source itself is the constraint — 41 of them are on tanker supply today.',
        'ஜல் ஜீவன் திட்ட நிலை: 486 குடியிருப்புகளில் 412-இல் செயல்படும் வீட்டு குழாய் இணைப்பு — 84.8%; மாநில சராசரி 81.2%. மீதமுள்ள 74 தளி மற்றும் தேன்கனிக்கோட்டையில்; அங்கு நீர் ஆதாரமே தடை — அவற்றில் 41 இன்று தொட்டி லாரி விநியோகத்தில்.',
      ),
      bi(
        'What the district is asking for: administrative sanction for the Kelavarapalli combined water supply scheme, ₹64.20 crore, which closes 61 of the 74. The DPR was submitted on 12 September 2024 and is pending technical clearance with TWAD board.',
        'மாவட்டம் கோருவது: கேளவரப்பள்ளி ஒருங்கிணைந்த குடிநீர் திட்டத்திற்கு ₹64.20 கோடி நிர்வாக ஒப்புதல் — இது 74-இல் 61-ஐ முடிக்கும். விரிவான திட்ட அறிக்கை 12 செப்டம்பர் 2024-இல் அளிக்கப்பட்டது, குடிநீர் வாரியத்தில் தொழில்நுட்ப ஒப்புதல் நிலுவையில்.',
      ),
      bi(
        'Breakfast scheme: 1,182 schools, 1,04,820 children, coverage held at 97.4% for three consecutive weeks. Two gaps to report — 11 schools without a separate kitchen shed, and cook honorarium for September pending in 34 schools because of a treasury code mismatch, which the DEO has been asked to reconcile by Friday.',
        'காலை உணவுத் திட்டம்: 1,182 பள்ளிகள், 1,04,820 குழந்தைகள், மூன்று வாரங்கள் தொடர்ந்து 97.4% பயன். தெரிவிக்க வேண்டிய இரு இடைவெளிகள் — 11 பள்ளிகளில் தனி சமையலறை இல்லை; கருவூல குறியீடு பொருந்தாததால் 34 பள்ளிகளில் செப்டம்பர் சமையலர் ஊதியம் நிலுவை, வெள்ளிக்கிழமைக்குள் சரிசெய்ய மாவட்டக் கல்வி அலுவலருக்கு அறிவுறுத்தப்பட்டுள்ளது.',
      ),
      bi(
        'One risk to place on record: 2,140 PM-KISAN records in Uthangarai block are without Aadhaar seeding and will miss the payment cycle in six days. Two additional camps a day have been ordered from tomorrow.',
        'பதிவு செய்ய வேண்டிய ஓர் ஆபத்து: ஊத்தங்கரை ஒன்றியத்தில் 2,140 பிரதமர் கிசான் பதிவுகளில் ஆதார் இணைப்பு இல்லை; ஆறு நாட்களில் பணச் சுழற்சியை இழக்கும். நாளை முதல் நாளொன்றுக்கு இரு கூடுதல் முகாம்கள் உத்தரவிடப்பட்டுள்ளன.',
      ),
      bi(
        'Commitment offered: household tap connection coverage to 92% by 31 January 2025 subject to the Kelavarapalli sanction, and zero petitions above 45 days in the water and sanitation category by 30 November 2024.',
        'அளிக்கப்படும் உறுதி: கேளவரப்பள்ளி ஒப்புதலுக்கு உட்பட்டு 31 ஜனவரி 2025-க்குள் வீட்டு குழாய் இணைப்பு 92%; 30 நவம்பர் 2024-க்குள் குடிநீர் மற்றும் சுத்தம் பிரிவில் 45 நாட்களுக்கு மேல் நிலுவை மனுக்கள் பூஜ்யம்.',
      ),
    ],
  },
  {
    id: 'd4',
    icon: 'event_note',
    title: bi('Agenda — weekly grievance review', 'நிகழ்ச்சி நிரல் — வாராந்திர மனு ஆய்வு'),
    note: bi('Ranked by ageing and by officer, not by department order', 'துறை வரிசையில் அல்ல, காலம் மற்றும் அலுவலர் அடிப்படையில்'),
    basis: bi('96 petitions on the Collector’s desk', 'ஆட்சியர் மேசையில் 96 மனுக்கள்'),
    meta: bi('75 minutes · 6 items · owners named', '75 நிமிடம் · 6 பொருள் · உரிமையாளர் குறிப்பு'),
    paragraphs: [
      bi(
        'Item 1 (15 min) — Petitions above 45 days: 96 on the desk, of which 31 are above 45 days and 4 above 60. Berigai water CM/KRI/88214 at 68 days is taken first, with a dated milestone to be recorded in the minutes. Owner: BDO Shoolagiri.',
        'பொருள் 1 (15 நிமிடம்) — 45 நாட்களுக்கு மேல் உள்ள மனுக்கள்: மேசையில் 96, அதில் 31 மனுக்கள் 45 நாட்களுக்கு மேல், 4 மனுக்கள் 60-க்கு மேல். 68 நாட்களுடன் பேரிகை குடிநீர் CM/KRI/88214 முதலில்; நடவடிக்கைக் குறிப்பில் தேதியுடன் இலக்கு பதிவு செய்யப்பட வேண்டும். உரிமையாளர்: ஒன்றிய அலுவலர், சூளகிரி.',
      ),
      bi(
        'Item 2 (10 min) — Re-opened disposals: Denkanikottai is re-opening 11.4% of disposed patta files against a district rate of 3.1%. Cause identified as disposal recorded before the FMB sketch is attached. Owner: Tahsildar Denkanikottai.',
        'பொருள் 2 (10 நிமிடம்) — மீண்டும் திறந்த தீர்வுகள்: மாவட்ட விகிதம் 3.1% ஆக இருக்கும்போது தேன்கனிக்கோட்டையில் தீர்வு செய்யப்பட்ட பட்டா கோப்புகளில் 11.4% மீண்டும் திறக்கப்படுகிறது. காரணம்: FMB வரைபடம் இணைக்கும் முன் தீர்வு பதிவு. உரிமையாளர்: வட்டாட்சியர், தேன்கனிக்கோட்டை.',
      ),
      bi(
        'Item 3 (15 min) — Water and sanitation cluster: 7 petitions from 4 Berigai habitations name the same overhead tank. To be treated as one asset failure with a single repair estimate rather than seven replies. Owner: Executive Engineer, TWAD.',
        'பொருள் 3 (15 நிமிடம்) — குடிநீர் மற்றும் சுத்தம் கொத்து: பேரிகையின் 4 குடியிருப்புகளிலிருந்து 7 மனுக்கள் ஒரே மேல்நிலைத் தொட்டியைக் குறிக்கின்றன. ஏழு பதில்களுக்குப் பதிலாக ஒரே பழுது மதிப்பீட்டுடன் ஒரு சொத்துக் கோளாறாகக் கருதப்பட வேண்டும். உரிமையாளர்: செயற்பொறியாளர், குடிநீர் வாரியம்.',
      ),
      bi(
        'Item 4 (10 min) — Pension and DBT: 2,140 PM-KISAN records unseeded in Uthangarai; old age pension petition PG/KRI/7781 at 47 days. Camp schedule to be tabled. Owner: BDO Uthangarai and DSWO.',
        'பொருள் 4 (10 நிமிடம்) — ஓய்வூதியம் மற்றும் நேரடி பயன்: ஊத்தங்கரையில் 2,140 பிரதமர் கிசான் பதிவுகள் இணைக்கப்படவில்லை; முதியோர் ஓய்வூதிய மனு PG/KRI/7781 47 நாட்கள். முகாம் அட்டவணை சமர்ப்பிக்கப்பட வேண்டும். உரிமையாளர்: ஒன்றிய அலுவலர், ஊத்தங்கரை மற்றும் மாவட்ட சமூக நல அலுவலர்.',
      ),
      bi(
        'Item 5 (15 min) — Officer-wise ageing: four desks hold 61% of everything above 45 days. Each names a date by which its oldest three will close, recorded against the officer in the minutes.',
        'பொருள் 5 (15 நிமிடம்) — அலுவலர் வாரியாக காலம்: 45 நாட்களுக்கு மேல் உள்ள அனைத்திலும் 61% நான்கு மேசைகளில். ஒவ்வொருவரும் தமது பழைய மூன்று மனுக்கள் முடியும் தேதியைக் குறிப்பிட வேண்டும், நடவடிக்கைக் குறிப்பில் அலுவலர் பெயருடன் பதிவு.',
      ),
      bi(
        'Item 6 (10 min) — Next week’s exposure: 11 petitions cross 30 days and 6 cross 45 days before the next review. List circulated with owners; no discussion unless a desk disputes the count.',
        'பொருள் 6 (10 நிமிடம்) — அடுத்த வாரத்தின் இடர்: அடுத்த ஆய்வுக்கு முன் 11 மனுக்கள் 30 நாட்களையும் 6 மனுக்கள் 45 நாட்களையும் கடக்கும். உரிமையாளர்களுடன் பட்டியல் வழங்கப்பட்டுள்ளது; எண்ணிக்கையில் மறுப்பு இல்லையெனில் விவாதம் இல்லை.',
      ),
    ],
  },
  {
    id: 'd5',
    icon: 'campaign',
    title: bi('Press note — drinking water action taken', 'செய்திக் குறிப்பு — குடிநீர் நடவடிக்கை'),
    note: bi('For release in Tamil and English', 'தமிழ் மற்றும் ஆங்கிலத்தில் வெளியிட'),
    basis: bi('Berigai · 41 habitations on tanker', 'பேரிகை · 41 குடியிருப்பு தொட்டி லாரியில்'),
    meta: bi('Plain figures, no adjectives · 3 paragraphs', 'எண்கள் மட்டும், அடைமொழி இல்லை · 3 பாராக்கள்'),
    paragraphs: [
      bi(
        'Krishnagiri, 24 October 2024: The district administration has taken up the drinking water shortage reported from Berigai panchayat in Shoolagiri block. Tanker supply of 12 trips a day is in place for the four affected habitations, covering 1,860 households, and has been running without interruption since 18 October.',
        'கிருஷ்ணகிரி, 24 அக்டோபர் 2024: சூளகிரி ஒன்றியம் பேரிகை ஊராட்சியில் தெரிவிக்கப்பட்ட குடிநீர் தட்டுப்பாட்டை மாவட்ட நிர்வாகம் கையில் எடுத்துள்ளது. பாதிக்கப்பட்ட நான்கு குடியிருப்புகளுக்கு நாளொன்றுக்கு 12 சுற்று தொட்டி லாரி விநியோகம் அமல்படுத்தப்பட்டு, 1,860 குடும்பங்களுக்குச் சென்றடைகிறது; 18 அக்டோபர் முதல் தடையின்றி தொடர்கிறது.',
      ),
      bi(
        'On inspection it was found that a single overhead tank serving the four habitations had failed. Repair has been sanctioned at an estimate of ₹18.40 lakh and the work has been entrusted to the TWAD board with a completion date of 06 November 2024. The Executive Engineer has been directed to report progress to the Collector every third day.',
        'ஆய்வில், நான்கு குடியிருப்புகளுக்கும் நீர் வழங்கும் ஒரே மேல்நிலைத் தொட்டி பழுதடைந்திருந்தது தெரியவந்தது. ₹18.40 லட்சம் மதிப்பீட்டில் பழுது நீக்கத்திற்கு ஒப்புதல் அளிக்கப்பட்டு, 06 நவம்பர் 2024 நிறைவுத் தேதியுடன் குடிநீர் வாரியத்திற்குப் பணி ஒப்படைக்கப்பட்டுள்ளது. மூன்று நாளுக்கு ஒருமுறை ஆட்சியருக்கு முன்னேற்றம் தெரிவிக்க செயற்பொறியாளருக்கு அறிவுறுத்தப்பட்டுள்ளது.',
      ),
      bi(
        'For a permanent solution the Kelavarapalli combined water supply scheme, estimated at ₹64.20 crore, has been proposed to Government; it will cover 61 habitations including Berigai. Complaints on drinking water may be given on the district helpline 1077 or at the Grievance Day held every Monday at the Collectorate.',
        'நிரந்தரத் தீர்வுக்காக ₹64.20 கோடி மதிப்பிடப்பட்ட கேளவரப்பள்ளி ஒருங்கிணைந்த குடிநீர் திட்டம் அரசுக்குப் பரிந்துரைக்கப்பட்டுள்ளது; பேரிகை உட்பட 61 குடியிருப்புகளுக்கு இது பயன் அளிக்கும். குடிநீர் தொடர்பான புகார்களை மாவட்ட உதவி எண் 1077 அல்லது ஒவ்வொரு திங்கள்கிழமையும் ஆட்சியர் அலுவலகத்தில் நடைபெறும் மனுநீதி நாளில் அளிக்கலாம்.',
      ),
    ],
  },
]

/* ------------------------------------------------------------------ *
 * Audit log — the district's record of what was asked of the model.
 * ------------------------------------------------------------------ */

export type AuditRow = {
  at: string
  who: Bi
  question: Bi
  datasets: string
  rows: string
  ms: number
  outcome: Bi
  tone: Tone
}

export const AUDIT: AuditRow[] = [
  {
    at: '09:38',
    who: bi('Collector', 'ஆட்சியர்'),
    question: bi('What needs my decision today?', 'இன்று என் முடிவு தேவைப்படுவது என்ன?'),
    datasets: 'CM Cell, Star 2.0, IFHRMS, CCTNS',
    rows: '18,204',
    ms: 2140,
    outcome: bi('Answered', 'பதில் அளிக்கப்பட்டது'),
    tone: 'good',
  },
  {
    at: '09:12',
    who: bi('Collector', 'ஆட்சியர்'),
    question: bi('Why is the Berigai drinking water petition still open?', 'பேரிகை குடிநீர் மனு ஏன் இன்னும் நிலுவையில்?'),
    datasets: 'CM Cell, TWAD works',
    rows: '2,411',
    ms: 1980,
    outcome: bi('Answered · action drafted', 'பதில் · நடவடிக்கை வரைவு'),
    tone: 'good',
  },
  {
    at: '08:55',
    who: bi('RDO Krishnagiri', 'கோட்டாட்சியர், கிருஷ்ணகிரி'),
    question: bi('Patta transfer pendency by taluk', 'வட்டம் வாரியாக பட்டா மாற்ற நிலுவை'),
    datasets: 'Star 2.0',
    rows: '9,860',
    ms: 1620,
    outcome: bi('Answered · scoped to division', 'பதில் · கோட்டத்திற்கு வரம்பு'),
    tone: 'info',
  },
  {
    at: '08:31',
    who: bi('BDO Shoolagiri', 'ஒன்றிய அலுவலர், சூளகிரி'),
    question: bi('District-wide MGNREGS wage delay', 'மாவட்ட அளவில் நூறு நாள் வேலை ஊதிய தாமதம்'),
    datasets: 'PFMS',
    rows: '1,204',
    ms: 1450,
    outcome: bi('Scoped down to Shoolagiri block', 'சூளகிரி ஒன்றியத்திற்கு வரம்பு'),
    tone: 'warning',
  },
  {
    at: '08:04',
    who: bi('Joint Director, Health', 'இணை இயக்குநர், சுகாதாரம்'),
    question: bi('Is fever surveillance showing an outbreak?', 'காய்ச்சல் கண்காணிப்பில் பரவல் தெரிகிறதா?'),
    datasets: 'NCD, PICME',
    rows: '36,010',
    ms: 2620,
    outcome: bi('Answered · forecast attached', 'பதில் · கணிப்பு இணைப்பு'),
    tone: 'good',
  },
  {
    at: '07:47',
    who: bi('Tahsildar Hosur', 'வட்டாட்சியர், ஓசூர்'),
    question: bi('Personal mobile number of a petitioner', 'மனுதாரரின் தனிப்பட்ட கைபேசி எண்'),
    datasets: '—',
    rows: '0',
    ms: 240,
    outcome: bi('Refused · personal data', 'மறுக்கப்பட்டது · தனிநபர் தரவு'),
    tone: 'critical',
  },
  {
    at: '06:00',
    who: bi('System', 'அமைப்பு'),
    question: bi('Generate the morning brief', 'காலை சுருக்கம் உருவாக்கு'),
    datasets: bi('11 feeds', '11 தரவு').en,
    rows: '1.42 L',
    ms: 4210,
    outcome: bi('5 items published', '5 பொருள் வெளியீடு'),
    tone: 'good',
  },
]

/** Headline numbers for the Trust tab. */
export const AUDIT_SUMMARY = [
  { label: bi('Questions today', 'இன்றைய வினாக்கள்'), value: '128', footnote: bi('41 officers', '41 அலுவலர்') },
  { label: bi('Median response', 'இடைநிலை பதில் நேரம்'), value: '1.9', unit: bi('seconds', 'வினாடி').en, footnote: bi('p95 3.4 s', 'p95 3.4 வி') },
  { label: bi('Answers with a source', 'மூலத்துடன் பதில்'), value: '100%', footnote: bi('No figure without a feed', 'தரவு இல்லாத எண் இல்லை') },
  { label: bi('Refused by guardrail', 'பாதுகாப்பால் மறுப்பு'), value: '6', footnote: bi('Personal data or out of scope', 'தனிநபர் தரவு அல்லது எல்லைக்கு வெளியே') },
  { label: bi('Actions drafted', 'வரைவு நடவடிக்கை'), value: '23', footnote: bi('All signed by an officer', 'அனைத்தும் அலுவலர் கையொப்பம்') },
]
