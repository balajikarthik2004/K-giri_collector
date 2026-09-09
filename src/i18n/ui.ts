import { bi } from './index'

/** Application chrome. Domain copy lives beside its data in src/data/. */
export const ui = {
  appName: bi('Krishnagiri District', 'கிருஷ்ணகிரி மாவட்டம்'),
  appSub: bi('Collectorate Command Portal', 'ஆட்சியர் கட்டளை மையம்'),
  collector: bi('Thiru C. Dinesh Kumar, IAS', 'திரு சி. தினேஷ் குமார், இ.ஆ.ப.'),
  collectorRole: bi('District Collector & Magistrate', 'மாவட்ட ஆட்சித்தலைவர்'),

  briefingDate: bi('24 Oct 2024 · Thu', 'அக் 24, 2024 · வியாழன்'),

  search: bi('File no, petitioner, survey no, village, officer…', 'கோப்பு எண், மனுதாரர், புல எண், கிராமம், அலுவலர்…'),
  searchShort: bi('Search', 'தேடு'),
  noResults: bi('No matching records', 'பொருந்தும் பதிவுகள் இல்லை'),

  // Actions
  print: bi('Print review pack', 'ஆய்வுக் கோப்பு அச்சிடு'),
  printShort: bi('Print', 'அச்சிடு'),
  exportCsv: bi('Export CSV', 'CSV ஏற்றுமதி'),
  pushMobile: bi('Push to mobile', 'கைபேசிக்கு அனுப்பு'),
  callOfficer: bi('Call officer', 'அலுவலரை அழை'),
  viewFile: bi('Open file', 'கோப்பைத் திற'),
  drillDown: bi('Drill down', 'விரிவாகப் பார்'),
  close: bi('Close', 'மூடு'),
  all: bi('All', 'அனைத்தும்'),
  back: bi('Back', 'பின்'),
  menu: bi('Menu', 'பட்டி'),
  sign: bi('Sign', 'கையொப்பம்'),
  approve: bi('Approve', 'ஒப்புதல்'),
  escalate: bi('Escalate', 'மேல்முறையீடு'),
  showTable: bi('Table view', 'அட்டவணைக் காட்சி'),
  showChart: bi('Chart view', 'வரைபடக் காட்சி'),

  // Scopes & roles
  role: bi('Role', 'பணியிடம்'),
  scope: bi('Scope', 'எல்லை'),
  district: bi('District', 'மாவட்டம்'),
  taluk: bi('Taluk', 'வட்டம்'),
  block: bi('Block', 'ஒன்றியம்'),
  panchayat: bi('Panchayat', 'ஊராட்சி'),
  ward: bi('Ward', 'வார்டு'),
  department: bi('Department', 'துறை'),
  officer: bi('Officer', 'அலுவலர்'),
  mapView: bi('Map view', 'வரைபடக் காட்சி'),
  listView: bi('List view', 'பட்டியல் காட்சி'),

  // Status vocabulary
  onTrack: bi('On track', 'சரியான பாதையில்'),
  watch: bi('Watch', 'கண்காணிப்பு'),
  atRisk: bi('At risk', 'ஆபத்தில்'),
  breached: bi('Breached', 'மீறப்பட்டது'),
  pending: bi('Pending', 'நிலுவை'),
  disposed: bi('Disposed', 'தீர்வு'),
  received: bi('Received', 'பெறப்பட்டது'),
  overdue: bi('Overdue', 'காலம் கடந்தது'),
  target: bi('Target', 'இலக்கு'),
  achieved: bi('Achieved', 'எட்டியது'),
  normal: bi('Normal', 'இயல்பு'),
  critical: bi('Critical', 'தீவிரம்'),
  vacancy: bi('Vacancy', 'காலியிடம்'),
  today: bi('Today', 'இன்று'),
  day: bi('day', 'நாள்'),
  days: bi('days', 'நாட்கள்'),
  vs: bi('vs', 'ஒப்பீடு'),

  // Chrome
  lastUpdated: bi('Updated', 'புதுப்பிப்பு'),
  source: bi('Source', 'மூலம்'),
  auditTrail: bi('Audit trail', 'தணிக்கைத் தடம்'),
  updatedBy: bi('Updated by', 'புதுப்பித்தவர்'),
  needsAttention: bi("Needs Collector's attention", 'ஆட்சியர் கவனத்திற்கு'),
  actionQueue: bi('Action queue', 'நடவடிக்கைப் பட்டியல்'),
  quickActions: bi('Quick actions', 'விரைவு நடவடிக்கை'),
  liveTelemetry: bi('Live from TN e-Governance State Data Center', 'தமிழ்நாடு மின்-ஆளுமை தரவு மையத்திலிருந்து நேரலை'),
  offlineHint: bi('Optimised for 4G', '4G-க்கு உகந்தது'),
  restrictedView: bi('Filtered to your jurisdiction', 'உங்கள் அதிகார எல்லைக்கு மட்டும்'),
  pushed: bi('Sent to your mobile', 'உங்கள் கைபேசிக்கு அனுப்பப்பட்டது'),
  copied: bi('Review pack ready', 'ஆய்வுக் கோப்பு தயார்'),
}

export const roles = {
  collector: bi('Collector', 'ஆட்சியர்'),
  rdo: bi('RDO', 'கோட்டாட்சியர்'),
  bdo: bi('BDO', 'ஒன்றிய அலுவலர்'),
  tahsildar: bi('Tahsildar', 'வட்டாட்சியர்'),
  hod: bi('Dept. head', 'துறைத் தலைவர்'),
}
