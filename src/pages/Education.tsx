import { useState } from 'react'
import { bi, num, pct, useI18n, type Bi } from '../i18n'
import { PageHead } from '../components/ui/PageHead'
import { Panel, PanelHead, Stat, StatGrid, Status } from '../components/ui/Primitives'
import { BarList, ColumnChart, SERIES } from '../components/ui/Charts'
import { DataTable, type Column } from '../components/ui/DataTable'
import { DrillDrawer, type Drill } from '../components/ui/Drawer'
import { BLOCKS, DESIG, SRC } from '../data/common'

type BlockRow = {
  id: string
  block: Bi
  enrolment: number
  dropout: number
  breakfast: number
  itk: number
  tone: 'good' | 'warning' | 'serious' | 'critical'
}

const ROWS: BlockRow[] = BLOCKS.map((block, index) => {
  const dropout = [0.4, 0.6, 1.2, 2.1, 1.6, 0.8, 2.4, 1.9, 0.7, 1.1][index]
  return {
    id: `blk-${index}`,
    block,
    enrolment: [28400, 34200, 19600, 12400, 14800, 16200, 11200, 18600, 15400, 13800][index],
    dropout,
    breakfast: [98, 97, 96, 92, 94, 95, 89, 91, 96, 93][index],
    itk: [88, 91, 84, 76, 80, 82, 71, 74, 86, 79][index],
    tone: dropout > 2 ? 'critical' : dropout > 1.5 ? 'serious' : dropout > 1 ? 'warning' : 'good',
  }
})

type Gap = {
  id: string
  issue: Bi
  schools: number
  worst: Bi
  tone: 'critical' | 'serious' | 'warning'
}

const GAPS: Gap[] = [
  { id: 'g1', issue: bi('Compound wall missing / damaged', 'சுற்றுச்சுவர் இல்லை / சேதம்'), schools: 84, worst: BLOCKS[6], tone: 'critical' },
  { id: 'g2', issue: bi('Toilets not functional', 'கழிப்பறை செயல்படவில்லை'), schools: 62, worst: BLOCKS[3], tone: 'critical' },
  { id: 'g3', issue: bi('Drinking water unavailable', 'குடிநீர் வசதி இல்லை'), schools: 38, worst: BLOCKS[7], tone: 'serious' },
  { id: 'g4', issue: bi('Classroom repair needed', 'வகுப்பறை பழுது'), schools: 116, worst: BLOCKS[2], tone: 'serious' },
  { id: 'g5', issue: bi('Electrification incomplete', 'மின் இணைப்பு முழுமையடையவில்லை'), schools: 21, worst: BLOCKS[4], tone: 'warning' },
]

const PASS_TREND = [
  { label: bi('2020', '2020'), a: 91.2, b: 88.4 },
  { label: bi('2021', '2021'), a: 100, b: 100 },
  { label: bi('2022', '2022'), a: 93.8, b: 90.1 },
  { label: bi('2023', '2023'), a: 94.6, b: 91.8 },
  { label: bi('2024', '2024'), a: 96.1, b: 93.4 },
]

export function EducationPage() {
  const { t } = useI18n()
  const [drill, setDrill] = useState<Drill | null>(null)

  const columns: Column<BlockRow>[] = [
    { key: 'block', head: bi('Block', 'ஒன்றியம்'), text: (row) => t(row.block) },
    { key: 'enrol', head: bi('Enrolment', 'சேர்க்கை'), align: 'right', text: (row) => num(row.enrolment) },
    {
      key: 'dropout',
      head: bi('Dropout', 'இடைநிற்றல்'),
      align: 'right',
      text: (row) => pct(row.dropout),
      render: (row) => <Status tone={row.tone} label={pct(row.dropout)} />,
    },
    { key: 'breakfast', head: bi('Breakfast scheme', 'காலை உணவுத் திட்டம்'), align: 'right', text: (row) => pct(row.breakfast, 0) },
    { key: 'itk', head: bi('Illam Thedi Kalvi', 'இல்லம் தேடி கல்வி'), align: 'right', text: (row) => pct(row.itk, 0), minor: true },
  ]

  const gapColumns: Column<Gap>[] = [
    { key: 'issue', head: bi('Infrastructure gap', 'உள்கட்டமைப்பு குறை'), text: (row) => t(row.issue) },
    {
      key: 'schools',
      head: bi('Schools', 'பள்ளிகள்'),
      align: 'right',
      text: (row) => num(row.schools),
      render: (row) => <Status tone={row.tone} label={num(row.schools)} />,
    },
    { key: 'worst', head: bi('Worst block', 'அதிக பாதிப்பு'), text: (row) => t(row.worst), minor: true },
  ]

  return (
    <div className="flex flex-col gap-4">
      <PageHead
        title={bi('School education', 'பள்ளிக் கல்வி')}
        note={bi('Enrolment, retention, meals and infrastructure', 'சேர்க்கை, தொடர்ச்சி, உணவு மற்றும் உள்கட்டமைப்பு')}
        icon="school"
      />

      <StatGrid>
        <Stat label={bi('Total enrolment', 'மொத்த சேர்க்கை')} value={num(184600)} footnote={bi('1,842 government schools', '1,842 அரசுப் பள்ளிகள்')} />
        <Stat label={bi('Dropout rate', 'இடைநிற்றல் விகிதம்')} value="1.28%" delta="-0.4" deltaTone="good" />
        <Stat label={bi('Breakfast scheme', 'காலை உணவுத் திட்டம்')} value="94.1%" delta={t(bi('1,204 schools', '1,204 பள்ளிகள்'))} deltaTone="good" meter={94.1} meterTone="good" />
        <Stat label={bi('Teacher vacancies', 'ஆசிரியர் காலியிடம்')} value="386" delta={t(bi('of 8,940', '8,940-ல்'))} deltaTone="bad" />
        <Stat label={bi('Class 10 pass', 'பத்தாம் வகுப்பு தேர்ச்சி')} value="96.1%" delta="+1.5" deltaTone="good" />
      </StatGrid>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <PanelHead
            icon="groups"
            title={bi('Block performance', 'ஒன்றிய செயல்திறன்')}
            note={bi('Enrolment, dropout and scheme coverage', 'சேர்க்கை, இடைநிற்றல் மற்றும் திட்டப் பரவல்')}
          />
          <DataTable
            columns={columns}
            rows={ROWS}
            rowKey={(row) => row.id}
            dense
            exportName="krishnagiri-education-blocks"
            onRowClick={(row) =>
              setDrill({
                title: t(row.block),
                ref: row.id.toUpperCase(),
                tone: row.tone,
                status: `${pct(row.dropout)} ${t(bi('dropout', 'இடைநிற்றல்'))}`,
                facts: [
                  { label: bi('Enrolment', 'சேர்க்கை'), value: num(row.enrolment) },
                  { label: bi('Dropout', 'இடைநிற்றல்'), value: pct(row.dropout) },
                  { label: bi('Breakfast scheme', 'காலை உணவு'), value: pct(row.breakfast, 0) },
                  { label: bi('Illam Thedi Kalvi', 'இல்லம் தேடி கல்வி'), value: pct(row.itk, 0) },
                  { label: bi('Schools', 'பள்ளிகள்'), value: '184' },
                  { label: bi('Teacher vacancies', 'ஆசிரியர் காலியிடம்'), value: '38' },
                ],
                officer: { name: 'M. Rajendran', designation: DESIG.ceo, phone: '+914343250099' },
                audit: { updated: '23 Oct 18:20', by: 'EMIS block upload', source: SRC.emis },
                actions: [{ label: bi('Order retention drive', 'தொடர் கல்வி இயக்கம்'), icon: 'campaign', variant: 'accent' }],
              })
            }
          />
        </Panel>

        <Panel>
          <PanelHead
            icon="construction"
            title={bi('Infrastructure gaps', 'உள்கட்டமைப்பு குறைபாடு')}
            note={bi('Government schools', 'அரசுப் பள்ளிகள்')}
          />
          <DataTable
            columns={gapColumns}
            rows={GAPS}
            rowKey={(row) => row.id}
            searchable={false}
            dense
            exportName="krishnagiri-school-infra-gaps"
          />
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel>
          <PanelHead
            icon="school"
            title={bi('Board results trend', 'பொதுத் தேர்வு முடிவு போக்கு')}
            note={bi('Pass percentage', 'தேர்ச்சி சதவீதம்')}
          />
          <ColumnChart
            data={PASS_TREND}
            seriesA={bi('Class 10', 'வகுப்பு 10')}
            seriesB={bi('Class 12', 'வகுப்பு 12')}
            unit="%"
            height={170}
          />
        </Panel>

        <Panel>
          <PanelHead
            icon="school"
            title={bi('Enrolment by block', 'ஒன்றியவாரி சேர்க்கை')}
            note={bi('Government and aided schools', 'அரசு மற்றும் உதவி பெறும் பள்ளிகள்')}
          />
          <BarList
            data={ROWS.slice(0, 8).map((row, index) => ({
              label: row.block,
              value: row.enrolment,
              color: SERIES[index % 2],
            }))}
          />
        </Panel>
      </div>

      <DrillDrawer drill={drill} onClose={() => setDrill(null)} />
    </div>
  )
}
