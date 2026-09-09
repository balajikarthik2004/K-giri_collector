import { useState } from 'react'
import { bi, num, pct, useI18n, type Bi } from '../i18n'
import { PageHead } from '../components/ui/PageHead'
import { Panel, PanelHead, Stat, StatGrid, Status } from '../components/ui/Primitives'
import { BarList, Donut, SERIES } from '../components/ui/Charts'
import { DataTable, type Column } from '../components/ui/DataTable'
import { DrillDrawer, type Drill } from '../components/ui/Drawer'
import { DESIG, SRC, TALUK_LIST } from '../data/common'

type Cadre = {
  id: string
  cadre: Bi
  sanctioned: number
  inPosition: number
  presentToday: number
  tone: 'good' | 'warning' | 'serious' | 'critical'
}

const CADRES: Cadre[] = [
  { id: 'c1', cadre: bi('Village Administrative Officer', 'கிராம நிர்வாக அலுவலர்'), sanctioned: 386, inPosition: 341, presentToday: 318, tone: 'warning' },
  { id: 'c2', cadre: bi('Revenue Inspector', 'வருவாய் ஆய்வாளர்'), sanctioned: 92, inPosition: 78, presentToday: 74, tone: 'serious' },
  { id: 'c3', cadre: bi('Block Development Officer', 'ஒன்றிய வளர்ச்சி அலுவலர்'), sanctioned: 20, inPosition: 18, presentToday: 17, tone: 'good' },
  { id: 'c4', cadre: bi('Village Assistant', 'கிராம உதவியாளர்'), sanctioned: 412, inPosition: 356, presentToday: 322, tone: 'serious' },
  { id: 'c5', cadre: bi('Junior Assistant', 'இளநிலை உதவியாளர்'), sanctioned: 264, inPosition: 231, presentToday: 214, tone: 'warning' },
  { id: 'c6', cadre: bi('Overseer / JE', 'கண்காணிப்பாளர் / இளநிலை பொறியாளர்'), sanctioned: 88, inPosition: 64, presentToday: 58, tone: 'critical' },
]

type Case = {
  id: string
  officer: string
  cadre: Bi
  charge: Bi
  stage: Bi
  ageDays: number
  tone: 'warning' | 'serious' | 'critical'
}

const CASES: Case[] = [
  { id: 'd1', officer: 'V. Ramachandran', cadre: bi('VAO', 'கி.நி.அ'), charge: bi('Unauthorised absence', 'அனுமதியற்ற வருகையின்மை'), stage: bi('Charge memo issued', 'குற்றச்சாட்டு அறிக்கை'), ageDays: 184, tone: 'critical' },
  { id: 'd2', officer: 'K. Selvi', cadre: bi('Junior Assistant', 'இளநிலை உதவியாளர்'), charge: bi('Delay in patta processing', 'பட்டா செயலாக்க தாமதம்'), stage: bi('Enquiry ongoing', 'விசாரணை நடைபெறுகிறது'), ageDays: 96, tone: 'serious' },
  { id: 'd3', officer: 'M. Prakash', cadre: bi('Revenue Inspector', 'வருவாய் ஆய்வாளர்'), charge: bi('Irregularity in survey', 'நில அளவையில் முறைகேடு'), stage: bi('Reply awaited', 'பதில் எதிர்பார்ப்பு'), ageDays: 64, tone: 'serious' },
  { id: 'd4', officer: 'A. Bhuvaneswari', cadre: bi('Village Assistant', 'கிராம உதவியாளர்'), charge: bi('Negligence in relief work', 'நிவாரணப் பணியில் அலட்சியம்'), stage: bi('Explanation called', 'விளக்கம் கோரப்பட்டது'), ageDays: 28, tone: 'warning' },
]

const ATTENDANCE = TALUK_LIST.map((taluk, index) => ({
  label: taluk,
  value: [94, 91, 88, 96, 86, 93, 90][index],
  note: '%',
}))

export function StaffPage() {
  const { t } = useI18n()
  const [drill, setDrill] = useState<Drill | null>(null)

  const totalSanctioned = CADRES.reduce((sum, row) => sum + row.sanctioned, 0)
  const totalInPosition = CADRES.reduce((sum, row) => sum + row.inPosition, 0)
  const totalPresent = CADRES.reduce((sum, row) => sum + row.presentToday, 0)

  const columns: Column<Cadre>[] = [
    { key: 'cadre', head: bi('Cadre', 'பணியிடம்'), text: (row) => t(row.cadre) },
    { key: 'sanc', head: bi('Sanctioned', 'அனுமதிக்கப்பட்டது'), align: 'right', text: (row) => num(row.sanctioned) },
    {
      key: 'pos',
      head: bi('In position', 'பணியில்'),
      align: 'right',
      text: (row) => num(row.inPosition),
      render: (row) => (
        <Status tone={row.tone} label={`${row.inPosition} (${num(row.sanctioned - row.inPosition)} ${t(bi('vac', 'காலி'))})`} />
      ),
    },
    {
      key: 'present',
      head: bi('Present today', 'இன்று வருகை'),
      align: 'right',
      text: (row) => `${row.presentToday} (${pct((row.presentToday / row.inPosition) * 100, 0)})`,
    },
  ]

  const caseColumns: Column<Case>[] = [
    { key: 'officer', head: bi('Officer', 'அலுவலர்'), text: (row) => `${row.officer} · ${t(row.cadre)}` },
    { key: 'charge', head: bi('Charge', 'குற்றச்சாட்டு'), text: (row) => t(row.charge) },
    { key: 'stage', head: bi('Stage', 'நிலை'), text: (row) => t(row.stage), minor: true },
    {
      key: 'age',
      head: bi('Age', 'காலம்'),
      align: 'right',
      text: (row) => `${row.ageDays} d`,
      render: (row) => <Status tone={row.tone} label={`${row.ageDays} d`} />,
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <PageHead
        title={bi('Staff, attendance & discipline', 'பணியாளர், வருகை & ஒழுங்கு')}
        note={bi('Field cadre strength, daily attendance and pending cases', 'கள பணியாளர் எண்ணிக்கை, தினசரி வருகை மற்றும் நிலுவை வழக்குகள்')}
        icon="badge"
      />

      <StatGrid>
        <Stat label={bi('Sanctioned posts', 'அனுமதிக்கப்பட்ட பணியிடம்')} value={num(totalSanctioned)} />
        <Stat label={bi('In position', 'பணியில்')} value={num(totalInPosition)} delta={pct((totalInPosition / totalSanctioned) * 100, 0)} deltaTone="neutral" meter={(totalInPosition / totalSanctioned) * 100} />
        <Stat label={bi('Vacancies', 'காலியிடங்கள்')} value={num(totalSanctioned - totalInPosition)} delta={t(bi('6 cadres', '6 பணியிடம்'))} deltaTone="bad" />
        <Stat label={bi('Present today', 'இன்று வருகை')} value={pct((totalPresent / totalInPosition) * 100, 1)} delta={num(totalPresent)} deltaTone="good" meter={(totalPresent / totalInPosition) * 100} meterTone="good" />
        <Stat label={bi('Disciplinary cases', 'ஒழுங்கு நடவடிக்கை')} value="4" delta={t(bi('1 over 6 months', '6 மாதத்திற்கு மேல் 1'))} deltaTone="bad" />
      </StatGrid>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <PanelHead
            icon="groups"
            title={bi('Cadre strength', 'பணியிட எண்ணிக்கை')}
            note={bi('Sanctioned, in position and present today', 'அனுமதி, பணியில் மற்றும் இன்றைய வருகை')}
          />
          <DataTable
            columns={columns}
            rows={CADRES}
            rowKey={(row) => row.id}
            exportName="krishnagiri-cadre-strength"
            onRowClick={(row) =>
              setDrill({
                title: t(row.cadre),
                ref: row.id.toUpperCase(),
                tone: row.tone,
                status: `${num(row.sanctioned - row.inPosition)} ${t(bi('vacancies', 'காலியிடம்'))}`,
                facts: [
                  { label: bi('Sanctioned', 'அனுமதி'), value: num(row.sanctioned) },
                  { label: bi('In position', 'பணியில்'), value: num(row.inPosition) },
                  { label: bi('Present today', 'இன்று வருகை'), value: num(row.presentToday) },
                  { label: bi('On leave', 'விடுப்பு'), value: num(row.inPosition - row.presentToday) },
                  { label: bi('Transfers due', 'மாறுதல் நிலுவை'), value: '12' },
                  { label: bi('Training due', 'பயிற்சி நிலுவை'), value: '28' },
                ],
                officer: { name: 'K. Rajavel', designation: DESIG.dro, phone: '+914343233333' },
                audit: { updated: '24 Oct 09:30', by: 'Biometric attendance sync', source: SRC.hrms },
                actions: [{ label: bi('Request posting', 'பணியிடம் கோரு'), icon: 'person_add', variant: 'accent' }],
              })
            }
          />
        </Panel>

        <Panel>
          <PanelHead
            icon="fingerprint"
            title={bi('Attendance by taluk', 'வட்டவாரி வருகை')}
            note={bi('Biometric, today', 'கைரேகை, இன்று')}
          />
          <BarList data={ATTENDANCE} max={100} />
          <div className="mt-4">
            <Donut
              size={116}
              centerValue={pct((totalPresent / totalInPosition) * 100, 0)}
              centerLabel={bi('present', 'வருகை')}
              data={[
                { label: bi('Present', 'வருகை'), value: totalPresent, color: SERIES[2] },
                { label: bi('Leave', 'விடுப்பு'), value: totalInPosition - totalPresent, color: SERIES[3] },
                { label: bi('Vacant', 'காலி'), value: totalSanctioned - totalInPosition, color: SERIES[1] },
              ]}
            />
          </div>
        </Panel>
      </div>

      <Panel>
        <PanelHead
          icon="gavel"
          title={bi('Disciplinary cases pending', 'நிலுவையில் உள்ள ஒழுங்கு வழக்குகள்')}
          note={bi('Ranked by age', 'காலம் அடிப்படையில்')}
        />
        <DataTable
          columns={caseColumns}
          rows={CASES}
          rowKey={(row) => row.id}
          exportName="krishnagiri-disciplinary-cases"
          onRowClick={(row) =>
            setDrill({
              title: row.officer,
              ref: row.id.toUpperCase(),
              tone: row.tone,
              status: row.stage,
              facts: [
                { label: bi('Cadre', 'பணியிடம்'), value: t(row.cadre) },
                { label: bi('Charge', 'குற்றச்சாட்டு'), value: t(row.charge) },
                { label: bi('Stage', 'நிலை'), value: t(row.stage) },
                { label: bi('Pending', 'நிலுவை'), value: `${row.ageDays} days` },
              ],
              officer: { name: 'K. Rajavel', designation: DESIG.dro, phone: '+914343233333' },
              audit: { updated: '15 Oct 10:00', by: 'Establishment section', source: SRC.hrms },
              actions: [{ label: bi('Fix enquiry date', 'விசாரணை தேதி'), icon: 'event', variant: 'primary' }],
            })
          }
        />
      </Panel>

      <DrillDrawer drill={drill} onClose={() => setDrill(null)} />
    </div>
  )
}
