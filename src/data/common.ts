import { bi, type Bi } from '../i18n'

/** The seven revenue taluks. Order is the one used in every district review. */
export const TALUKS = {
  krishnagiri: bi('Krishnagiri', 'கிருஷ்ணகிரி'),
  hosur: bi('Hosur', 'ஓசூர்'),
  denkanikottai: bi('Denkanikottai', 'தேன்கனிக்கோட்டை'),
  pochampalli: bi('Pochampalli', 'போச்சம்பள்ளி'),
  uthangarai: bi('Uthangarai', 'ஊத்தங்கரை'),
  bargur: bi('Bargur', 'பர்கூர்'),
  shoolagiri: bi('Shoolagiri', 'சூளகிரி'),
} satisfies Record<string, Bi>

export const TALUK_LIST: Bi[] = [
  TALUKS.krishnagiri,
  TALUKS.hosur,
  TALUKS.denkanikottai,
  TALUKS.pochampalli,
  TALUKS.uthangarai,
  TALUKS.bargur,
  TALUKS.shoolagiri,
]

export const BLOCKS: Bi[] = [
  bi('Krishnagiri', 'கிருஷ்ணகிரி'),
  bi('Hosur', 'ஓசூர்'),
  bi('Shoolagiri', 'சூளகிரி'),
  bi('Thally', 'தளி'),
  bi('Kelamangalam', 'கேளமங்கலம்'),
  bi('Bargur', 'பர்கூர்'),
  bi('Veppanapalli', 'வேப்பனப்பள்ளி'),
  bi('Uthangarai', 'ஊத்தங்கரை'),
  bi('Kaveripattinam', 'காவேரிப்பட்டினம்'),
  bi('Mathur', 'மாத்தூர்'),
]

export const MONTHS: Bi[] = [
  bi('May', 'மே'),
  bi('Jun', 'ஜூன்'),
  bi('Jul', 'ஜூலை'),
  bi('Aug', 'ஆக'),
  bi('Sep', 'செப்'),
  bi('Oct', 'அக்'),
]

/** Designations reused across drill-downs. */
export const DESIG = {
  dro: bi('District Revenue Officer', 'மாவட்ட வருவாய் அலுவலர்'),
  rdo: bi('Revenue Divisional Officer', 'கோட்டாட்சியர்'),
  tahsildar: bi('Tahsildar', 'வட்டாட்சியர்'),
  bdo: bi('Block Development Officer', 'ஒன்றிய வளர்ச்சி அலுவலர்'),
  vao: bi('Village Administrative Officer', 'கிராம நிர்வாக அலுவலர்'),
  ee: bi('Executive Engineer', 'செயற்பொறியாளர்'),
  dd: bi('Deputy Director', 'துணை இயக்குநர்'),
  ceo: bi('Chief Educational Officer', 'முதன்மைக் கல்வி அலுவலர்'),
  dms: bi('Joint Director, Health', 'இணை இயக்குநர், சுகாதாரம்'),
  sp: bi('Superintendent of Police', 'காவல் கண்காணிப்பாளர்'),
  commissioner: bi('Municipal Commissioner', 'நகராட்சி ஆணையர்'),
  gm: bi('General Manager, DIC', 'பொது மேலாளர், மாவட்ட தொழில் மையம்'),
  ao: bi('Accounts Officer', 'கணக்கு அலுவலர்'),
}

/** Audit sources — every figure names the system it came from. */
export const SRC = {
  eservices: bi('TN e-Services / Star 2.0', 'தமிழ்நாடு மின்-சேவை / ஸ்டார் 2.0'),
  cmcell: bi('CM Cell portal', 'முதல்வர் தனிப்பிரிவு இணையதளம்'),
  pgr: bi('CPGRAMS', 'மத்திய மனு தளம்'),
  dbt: bi('PFMS / DBT gateway', 'PFMS / நேரடி பயன் வழங்கல்'),
  agri: bi('Uzhavan portal', 'உழவன் செயலி'),
  pwd: bi('PWD WRD telemetry', 'பொதுப்பணித்துறை நீர்வள தரவு'),
  health: bi('NCD / PICME portal', 'சுகாதாரத் தரவு தளம்'),
  emis: bi('EMIS Tamil Nadu', 'தமிழ்நாடு கல்வித் தரவு தளம்'),
  sipcot: bi('SIPCOT single window', 'சிப்காட் ஒற்றைச் சாளரம்'),
  cctns: bi('CCTNS / control room', 'காவல் தரவு மையம்'),
  treasury: bi('IFHRMS treasury', 'IFHRMS கருவூலம்'),
  hrms: bi('HRMS attendance', 'HRMS வருகைப் பதிவு'),
  eroll: bi('ERONET / SSR', 'ERONET / சிறப்பு சுருக்கத் திருத்தம்'),
  survey: bi('Survey & Settlement', 'நிலஅளவை மற்றும் நிலவரித் திட்டத் துறை'),
}

export const NOW = bi('Today 09:40 IST', 'இன்று 09:40 IST')
