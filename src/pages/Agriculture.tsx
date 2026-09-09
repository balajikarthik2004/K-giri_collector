import { useState } from 'react'
import { bi, num, pct, useI18n, type Bi } from '../i18n'
import { PageHead } from '../components/ui/PageHead'
import { Panel, PanelHead, Stat, StatGrid, Status, Tag } from '../components/ui/Primitives'
import { ColumnChart, Sparkline, SERIES } from '../components/ui/Charts'
import { DataTable, type Column } from '../components/ui/DataTable'
import { DrillDrawer, type Drill } from '../components/ui/Drawer'
import { BLOCKS, DESIG, MONTHS, SRC } from '../data/common'

type RainRow = {
  id: string
  block: Bi
  actual: number
  normal: number
  sownPct: number
  tone: 'good' | 'warning' | 'serious' | 'critical'
}

const RAIN: RainRow[] = [
  { id: 'b1', block: BLOCKS[0], actual: 412, normal: 382, sownPct: 94, tone: 'good' },
  { id: 'b2', block: BLOCKS[1], actual: 468, normal: 402, sownPct: 96, tone: 'good' },
  { id: 'b3', block: BLOCKS[2], actual: 388, normal: 394, sownPct: 91, tone: 'good' },
  { id: 'b4', block: BLOCKS[3], actual: 512, normal: 448, sownPct: 98, tone: 'good' },
  { id: 'b5', block: BLOCKS[4], actual: 341, normal: 386, sownPct: 82, tone: 'warning' },
  { id: 'b6', block: BLOCKS[5], actual: 296, normal: 372, sownPct: 74, tone: 'serious' },
  { id: 'b7', block: BLOCKS[6], actual: 268, normal: 364, sownPct: 68, tone: 'critical' },
  { id: 'b8', block: BLOCKS[7], actual: 284, normal: 358, sownPct: 71, tone: 'serious' },
  { id: 'b9', block: BLOCKS[8], actual: 356, normal: 376, sownPct: 88, tone: 'good' },
  { id: 'b10', block: BLOCKS[9], actual: 372, normal: 380, sownPct: 90, tone: 'good' },
]

const RESERVOIRS = [
  { name: bi('Kelavarapalli', 'கெலவரப்பள்ளி'), now: 38.4, max: 44, inflow: 1420, outflow: 1150 },
  { name: bi('Barur', 'பர்கூர்'), now: 21.6, max: 28, inflow: 640, outflow: 410 },
  { name: bi('Pambar', 'பாம்பாறு'), now: 9.8, max: 16, inflow: 210, outflow: 180 },
  { name: bi('Krishnagiri (KRP)', 'கிருஷ்ணகிரி (கே.ஆர்.பி)'), now: 42.1, max: 52, inflow: 1980, outflow: 1520 },
]

type PriceRow = {
  id: string
  crop: Bi
  market: Bi
  price: number
  unit: Bi
  change: number
  trend: number[]
}

const PRICES: PriceRow[] = [
  { id: 'mango', crop: bi('Mango (Alphonso)', 'மாம்பழம் (அல்போன்சா)'), market: bi('Krishnagiri', 'கிருஷ்ணகிரி'), price: 6200, unit: bi('/ quintal', '/ குவிண்டால்'), change: 4.2, trend: [5400, 5600, 5900, 5750, 6050, 6200] },
  { id: 'mango-t', crop: bi('Mango (Totapuri)', 'மாம்பழம் (தோதாபுரி)'), market: bi('Krishnagiri', 'கிருஷ்ணகிரி'), price: 2850, unit: bi('/ quintal', '/ குவிண்டால்'), change: -2.8, trend: [3100, 3050, 2980, 2900, 2930, 2850] },
  { id: 'tomato', crop: bi('Tomato', 'தக்காளி'), market: bi('Hosur', 'ஓசூர்'), price: 1840, unit: bi('/ quintal', '/ குவிண்டால்'), change: 18.4, trend: [980, 1120, 1340, 1510, 1680, 1840] },
  { id: 'coconut', crop: bi('Coconut', 'தேங்காய்'), market: bi('Hosur', 'ஓசூர்'), price: 3420, unit: bi('/ 1000 nuts', '/ 1000 காய்'), change: 1.1, trend: [3300, 3340, 3380, 3360, 3400, 3420] },
  { id: 'ragi', crop: bi('Ragi', 'கேழ்வரகு'), market: bi('Uthangarai', 'ஊத்தங்கரை'), price: 3180, unit: bi('/ quintal', '/ குவிண்டால்'), change: 0.6, trend: [3120, 3140, 3150, 3160, 3170, 3180] },
]

const SOWN = [
  { label: MONTHS[0], a: 18400, b: 21000 },
  { label: MONTHS[1], a: 34200, b: 38000 },
  { label: MONTHS[2], a: 61800, b: 66000 },
  { label: MONTHS[3], a: 84600, b: 88000 },
  { label: MONTHS[4], a: 96200, b: 98000 },
  { label: MONTHS[5], a: 101400, b: 104000 },
]

export function AgriculturePage() {
  const { t } = useI18n()
  const [drill, setDrill] = useState<Drill | null>(null)

  const rainColumns: Column<RainRow>[] = [
    { key: 'block', head: bi('Block', 'ஒன்றியம்'), text: (row) => t(row.block) },
    { key: 'actual', head: bi('Actual (mm)', 'பெய்தது (மி.மீ)'), align: 'right', text: (row) => num(row.actual) },
    { key: 'normal', head: bi('Normal (mm)', 'இயல்பு (மி.மீ)'), align: 'right', text: (row) => num(row.normal), minor: true },
    {
      key: 'dev',
      head: bi('Deviation', 'வேறுபாடு'),
      align: 'right',
      text: (row) => pct(((row.actual - row.normal) / row.normal) * 100),
      render: (row) => {
        const dev = ((row.actual - row.normal) / row.normal) * 100
        return <Status tone={row.tone} label={`${dev > 0 ? '+' : ''}${num(dev, 1)}%`} />
      },
    },
    {
      key: 'sown',
      head: bi('Sown vs target', 'விதைப்பு / இலக்கு'),
      align: 'right',
      text: (row) => pct(row.sownPct, 0),
      render: (row) => (
        <span className="flex flex-col items-end gap-1">
          <span className="font-label-sm text-label-sm font-bold tabular-nums">{row.sownPct}%</span>
          <span className="block h-1.5 w-20 overflow-hidden rounded-full bg-surface-container">
            <span className="block h-full rounded-full bg-viz-3" style={{ width: `${row.sownPct}%` }} />
          </span>
        </span>
      ),
    },
  ]

  const priceColumns: Column<PriceRow>[] = [
    {
      key: 'crop',
      head: bi('Commodity', 'பொருள்'),
      text: (row) => t(row.crop),
      render: (row) => (
        <span className="flex flex-col">
          <span className="font-label-md text-label-md font-bold">{t(row.crop)}</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            {t(row.market)}
          </span>
        </span>
      ),
    },
    {
      key: 'price',
      head: bi('Modal price', 'நிலவும் விலை'),
      align: 'right',
      text: (row) => `₹${num(row.price)} ${t(row.unit)}`,
    },
    {
      key: 'change',
      head: bi('Week change', 'வார மாற்றம்'),
      align: 'right',
      text: (row) => `${row.change > 0 ? '+' : ''}${num(row.change, 1)}%`,
      render: (row) => (
        <Status
          tone={row.change > 10 ? 'warning' : row.change < -5 ? 'serious' : 'good'}
          label={`${row.change > 0 ? '+' : ''}${num(row.change, 1)}%`}
        />
      ),
    },
    {
      key: 'trend',
      head: bi('6-week trend', '6 வார போக்கு'),
      text: (row) => row.trend.join(' '),
      render: (row) => (
        <span className="block w-28">
          <Sparkline values={row.trend} height={26} tone={SERIES[row.change >= 0 ? 2 : 1]} />
        </span>
      ),
      minor: true,
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <PageHead
        title={bi('Agriculture, horticulture & water', 'வேளாண்மை, தோட்டக்கலை & நீர்')}
        note={bi("India's mango capital · rainfall, storage, prices", 'இந்தியாவின் மாம்பழத் தலைநகர் · மழை, நீர்த்தேக்கம், விலை')}
        icon="agriculture"
      />

      <StatGrid>
        <Stat label={bi('Season rainfall', 'பருவ மழை')} value="412" unit="mm" delta="+8%" deltaTone="good" />
        <Stat label={bi('Sown area', 'விதைப்புப் பரப்பு')} value={num(101400)} unit="ha" delta="97.5%" deltaTone="good" meter={97.5} meterTone="good" />
        <Stat label={bi('Mango area', 'மாந்தோப்பு பரப்பு')} value={num(38400)} unit="ha" footnote={bi('Totapuri & Alphonso belt', 'தோதாபுரி & அல்போன்சா பகுதி')} />
        <Stat label={bi('Crop insurance enrolled', 'பயிர் காப்பீடு')} value={num(62840)} delta="71.4%" deltaTone="bad" meter={71.4} meterTone="warning" />
        <Stat label={bi('Drought declarations pending', 'வறட்சி அறிவிப்பு நிலுவை')} value="2" delta={t(bi('blocks', 'ஒன்றியம்'))} deltaTone="bad" />
      </StatGrid>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <PanelHead
            icon="water_drop"
            title={bi('Rainfall vs normal by block', 'ஒன்றியவாரி மழை — இயல்புடன் ஒப்பீடு')}
            note={bi('Cumulative season total', 'பருவ மொத்தம்')}
          />
          <DataTable
            columns={rainColumns}
            rows={RAIN}
            rowKey={(row) => row.id}
            exportName="krishnagiri-rainfall-blocks"
            dense
            onRowClick={(row) =>
              setDrill({
                title: t(row.block),
                ref: `AGRI/${row.id.toUpperCase()}`,
                tone: row.tone,
                status: row.tone === 'critical' ? bi('Deficit', 'பற்றாக்குறை') : bi('Monitored', 'கண்காணிப்பு'),
                facts: [
                  { label: bi('Actual rainfall', 'பெய்த மழை'), value: `${num(row.actual)} mm` },
                  { label: bi('Normal', 'இயல்பு'), value: `${num(row.normal)} mm` },
                  { label: bi('Sown vs target', 'விதைப்பு / இலக்கு'), value: `${row.sownPct}%` },
                  { label: bi('Rain gauges', 'மழை அளவிகள்'), value: '4 stations' },
                  { label: bi('Insurance enrolled', 'காப்பீடு'), value: '6,140' },
                  { label: bi('Fertilizer stock', 'உர இருப்பு'), value: '18 days' },
                ],
                officer: { name: 'T. Ramesh', designation: DESIG.dd, phone: '+914343245512' },
                audit: { updated: '24 Oct 08:00', by: 'Agriculture dept. block feed', source: SRC.agri },
                actions: [{ label: bi('Propose relief', 'நிவாரணம் பரிந்துரை'), icon: 'volunteer_activism', variant: 'accent' }],
              })
            }
          />
        </Panel>

        <Panel>
          <PanelHead
            icon="waves"
            title={bi('Reservoir storage', 'நீர்த்தேக்க இருப்பு')}
            note={bi('Feet against full level', 'முழு மட்டத்தை ஒப்பிட அடி')}
          />
          <ul className="flex flex-col gap-3">
            {RESERVOIRS.map((dam) => {
              const fill = (dam.now / dam.max) * 100
              return (
                <li key={t(dam.name)}>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-label-md text-label-md font-bold text-on-surface">
                      {t(dam.name)}
                    </span>
                    <span className="font-label-sm text-label-sm tabular-nums text-on-surface">
                      {dam.now} / {dam.max} ft
                    </span>
                  </div>
                  <span className="mt-1 block h-2 overflow-hidden rounded-full bg-surface-container">
                    <span
                      className="block h-full rounded-full bg-viz-1"
                      style={{ width: `${fill}%` }}
                    />
                  </span>
                  <p className="mt-1 font-label-sm text-label-sm text-on-surface-variant">
                    {t(bi('Inflow', 'வரத்து'))} {num(dam.inflow)} ·{' '}
                    {t(bi('Outflow', 'வெளியேற்றம்'))} {num(dam.outflow)} {t(bi('cusecs', 'கன அடி'))}
                  </p>
                </li>
              )
            })}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel>
          <PanelHead
            icon="storefront"
            title={bi('Market prices', 'சந்தை விலை')}
            note={bi('Hosur and Krishnagiri regulated markets', 'ஓசூர் மற்றும் கிருஷ்ணகிரி ஒழுங்குமுறை விற்பனைக் கூடம்')}
          />
          <DataTable
            columns={priceColumns}
            rows={PRICES}
            rowKey={(row) => row.id}
            searchable={false}
            exportName="krishnagiri-market-prices"
          />
        </Panel>

        <Panel>
          <PanelHead
            icon="grass"
            title={bi('Sown area vs target', 'விதைப்புப் பரப்பு / இலக்கு')}
            note={bi('Hectares, cumulative', 'ஹெக்டேர், ஒட்டுமொத்தம்')}
          />
          <ColumnChart
            data={SOWN}
            seriesA={bi('Sown', 'விதைப்பு')}
            seriesB={bi('Target', 'இலக்கு')}
            height={170}
            unit=" ha"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <Tag label={bi('Fertilizer: 18 days stock', 'உரம்: 18 நாள் இருப்பு')} />
            <Tag label={bi('Co-op societies: 142', 'கூட்டுறவு சங்கம்: 142')} />
            <Tag label={bi('Seed subsidy: 84%', 'விதை மானியம்: 84%')} />
          </div>
        </Panel>
      </div>

      <DrillDrawer drill={drill} onClose={() => setDrill(null)} />
    </div>
  )
}
