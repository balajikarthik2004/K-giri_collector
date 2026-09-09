import { bi, type Bi } from '../i18n'
import { DESIG } from './common'

/**
 * Petitions currently with the Collector. Shared with the masthead search so a
 * reference number, petitioner or village typed there resolves to the same
 * record the Grievances page shows.
 */
export type Petition = {
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

export const PETITIONS: Petition[] = [
  { id: 'CM/KRI/88214', subject: bi('Drinking water shortage 12 days', '12 நாட்களாக குடிநீர் தட்டுப்பாடு'), petitioner: 'R. Selvarani', mobile: '94xxx 21870', village: bi('Berigai', 'பேரிகை'), dept: bi('TWAD', 'குடிநீர் வாரியம்'), channel: bi('CM Cell', 'முதல்வர் தனிப்பிரிவு'), age: 68, officer: 'S. Manivannan', designation: DESIG.bdo, phone: '+914344234567' },
  { id: 'US/KRI/40122', subject: bi('Patta transfer not effected after order', 'உத்தரவுக்குப் பின்னும் பட்டா மாற்றம் இல்லை'), petitioner: 'K. Munusamy', mobile: '90xxx 44120', village: bi('Kelamangalam', 'கேளமங்கலம்'), dept: bi('Revenue', 'வருவாய்'), channel: bi('Ungaludan Stalin', 'உங்களுடன் ஸ்டாலின்'), age: 54, officer: 'R. Vinoth', designation: DESIG.tahsildar, phone: '+914347222104' },
  { id: 'PG/KRI/7781', subject: bi('Old age pension arrears 3 months', 'முதியோர் ஓய்வூதிய நிலுவை 3 மாதம்'), petitioner: 'A. Lakshmi', mobile: '99xxx 10233', village: bi('Mathur', 'மாத்தூர்'), dept: bi('Social welfare', 'சமூக நலம்'), channel: bi('CPGRAMS', 'மத்திய மனு தளம்'), age: 47, officer: 'D. Priya', designation: DESIG.dswo, phone: '+914343240011' },
  { id: 'MM/KRI/5510', subject: bi('Street light not repaired', 'தெரு விளக்கு பழுது நீக்கப்படவில்லை'), petitioner: 'S. Bhaskar', mobile: '93xxx 77410', village: bi('Hosur ward 21', 'ஓசூர் வார்டு 21'), dept: bi('Municipality', 'நகராட்சி'), channel: bi('Makkaludan Mudhalvar', 'மக்களுடன் முதல்வர்'), age: 39, officer: 'V. Anand', designation: DESIG.commissioner, phone: '+914344245000' },
  { id: 'GD/KRI/9902', subject: bi('School compound wall collapsed', 'பள்ளி சுற்றுச்சுவர் இடிந்தது'), petitioner: 'P. Thangam', mobile: '80xxx 90188', village: bi('Veppanapalli', 'வேப்பனப்பள்ளி'), dept: bi('Education', 'கல்வி'), channel: bi('Grievance Day', 'மனுநீதி நாள்'), age: 33, officer: 'M. Rajendran', designation: DESIG.ceo, phone: '+914343250099' },
  { id: 'CM/KRI/88390', subject: bi('MGNREGS wages delayed 5 weeks', 'நூறு நாள் வேலை ஊதியம் 5 வாரம் தாமதம்'), petitioner: 'G. Kannan', mobile: '87xxx 33440', village: bi('Thally', 'தளி'), dept: bi('Rural development', 'ஊரக வளர்ச்சி'), channel: bi('CM Cell', 'முதல்வர் தனிப்பிரிவு'), age: 31, officer: 'S. Manivannan', designation: DESIG.bdo, phone: '+914344234567' },
]
