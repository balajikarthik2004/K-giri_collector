import { bi, type Bi } from '../i18n'

export type SectionId =
  | 'overview'
  | 'actions'
  | 'maps'
  | 'revenue'
  | 'grievances'
  | 'finance'
  | 'hr'
  | 'elections'
  | 'schemes'
  | 'agriculture'
  | 'industries'
  | 'infrastructure'
  | 'health'
  | 'education'
  | 'lawOrder'

export type RoleId = 'collector' | 'rdo' | 'bdo' | 'tahsildar' | 'hod'

export type Section = {
  id: SectionId
  icon: string
  label: Bi
  group: Bi
  /** Roles whose jurisdiction includes this section. */
  roles: RoleId[]
  /** Count shown as a nav pill — open items needing a decision. */
  badge?: number
  badgeTone?: 'critical' | 'warning'
}

const G = {
  command: bi('Command', 'கட்டளை'),
  admin: bi('Administration', 'நிர்வாகம்'),
  development: bi('Development', 'வளர்ச்சி'),
  human: bi('Human development', 'மனித வளர்ச்சி'),
  safety: bi('Safety', 'பாதுகாப்பு'),
}

export const SECTIONS: Section[] = [
  {
    id: 'overview',
    icon: 'overview',
    label: bi('My day', 'என் நாள்'),
    group: G.command,
    roles: ['collector', 'rdo', 'bdo', 'tahsildar', 'hod'],
  },
  {
    id: 'actions',
    icon: 'priority_high',
    label: bi('Action queue', 'நடவடிக்கைப் பட்டியல்'),
    group: G.command,
    roles: ['collector', 'rdo', 'bdo', 'tahsildar', 'hod'],
    badge: 18,
    badgeTone: 'critical',
  },
  {
    id: 'maps',
    icon: 'map',
    label: bi('Map & drill-down', 'வரைபடம் & விவரம்'),
    group: G.command,
    roles: ['collector', 'rdo', 'bdo', 'tahsildar', 'hod'],
  },
  {
    id: 'revenue',
    icon: 'real_estate_agent',
    label: bi('Revenue & land', 'வருவாய் & நிலம்'),
    group: G.admin,
    roles: ['collector', 'rdo', 'tahsildar'],
    badge: 214,
    badgeTone: 'warning',
  },
  {
    id: 'grievances',
    icon: 'mark_email_unread',
    label: bi('Grievances & CM cell', 'மனுக்கள் & முதல்வர் பிரிவு'),
    group: G.admin,
    roles: ['collector', 'rdo', 'bdo', 'tahsildar', 'hod'],
    badge: 96,
    badgeTone: 'critical',
  },
  {
    id: 'finance',
    icon: 'account_balance_wallet',
    label: bi('Finance & audit', 'நிதி & தணிக்கை'),
    group: G.admin,
    roles: ['collector', 'hod'],
  },
  {
    id: 'hr',
    icon: 'badge',
    label: bi('Staff & attendance', 'பணியாளர் & வருகை'),
    group: G.admin,
    roles: ['collector', 'rdo', 'bdo', 'tahsildar'],
  },
  {
    id: 'elections',
    icon: 'how_to_vote',
    label: bi('Elections & civic', 'தேர்தல் & குடிமை'),
    group: G.admin,
    roles: ['collector', 'rdo', 'tahsildar'],
  },
  {
    id: 'schemes',
    icon: 'volunteer_activism',
    label: bi('Schemes & DBT', 'நலத்திட்டங்கள் & நேரடி பயன்'),
    group: G.development,
    roles: ['collector', 'bdo', 'hod'],
  },
  {
    id: 'agriculture',
    icon: 'agriculture',
    label: bi('Agriculture & water', 'வேளாண்மை & நீர்'),
    group: G.development,
    roles: ['collector', 'bdo', 'hod'],
  },
  {
    id: 'industries',
    icon: 'factory',
    label: bi('Industry & jobs', 'தொழில் & வேலைவாய்ப்பு'),
    group: G.development,
    roles: ['collector', 'hod'],
  },
  {
    id: 'infrastructure',
    icon: 'water_drop',
    label: bi('Water & infrastructure', 'குடிநீர் & உள்கட்டமைப்பு'),
    group: G.development,
    roles: ['collector', 'bdo', 'hod'],
  },
  {
    id: 'health',
    icon: 'local_hospital',
    label: bi('Health', 'சுகாதாரம்'),
    group: G.human,
    roles: ['collector', 'bdo', 'hod'],
  },
  {
    id: 'education',
    icon: 'school',
    label: bi('Education', 'கல்வி'),
    group: G.human,
    roles: ['collector', 'bdo', 'hod'],
  },
  {
    id: 'lawOrder',
    icon: 'shield',
    label: bi('Law, order & disaster', 'சட்டம், ஒழுங்கு & பேரிடர்'),
    group: G.safety,
    roles: ['collector', 'rdo', 'tahsildar'],
  },
]

export const GROUP_ORDER: Bi[] = [G.command, G.admin, G.development, G.human, G.safety]

/** Jurisdiction each role actually reviews — shown in the scope chip. */
export const ROLE_SCOPE: Record<RoleId, Bi> = {
  collector: bi('Krishnagiri district', 'கிருஷ்ணகிரி மாவட்டம்'),
  rdo: bi('Krishnagiri revenue division', 'கிருஷ்ணகிரி வருவாய் கோட்டம்'),
  bdo: bi('Shoolagiri block', 'சூளகிரி ஒன்றியம்'),
  tahsildar: bi('Hosur taluk', 'ஓசூர் வட்டம்'),
  hod: bi('Department-wide', 'துறை முழுவதும்'),
}
