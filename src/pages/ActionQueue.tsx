import { useMemo, useState } from 'react'
import { bi, num, useI18n } from '../i18n'
import { ui } from '../i18n/ui'
import { Icon } from '../components/Icon'
import { PageHead } from '../components/ui/PageHead'
import { Btn, Panel, PanelHead, Segmented, Stat, StatGrid, Status } from '../components/ui/Primitives'
import { DrillDrawer, type Drill } from '../components/ui/Drawer'
import { SRC } from '../data/common'
import { ITEMS, KIND_ICON, KIND_LABEL, type Kind } from '../data/actions'
import { useApp } from '../app/store'

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
          <Btn
            label={bi('Share with HoDs', 'துறைத் தலைவர்களுக்கு அனுப்பு')}
            icon="group_add"
            variant="primary"
            onClick={() => notify(ui.pushed)}
          />
        </div>
      </Panel>

      <DrillDrawer drill={drill} onClose={() => setDrill(null)} />
    </div>
  )
}
