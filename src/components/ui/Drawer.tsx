import { useEffect, type ReactNode } from 'react'
import { Icon } from '../Icon'
import { useI18n, type Bi } from '../../i18n'
import { ui } from '../../i18n/ui'
import { Btn, Status, type Tone } from './Primitives'

/** A single drilled-into record: file, beneficiary, officer or work. */
export type Drill = {
  title: string
  ref?: string
  tone?: Tone
  status?: Bi | string
  facts: { label: Bi; value: ReactNode }[]
  officer?: { name: string; designation: Bi; phone: string }
  audit: { updated: string; by: string; source: Bi }
  actions?: { label: Bi; icon: string; variant?: 'primary' | 'accent' | 'danger' | 'secondary' }[]
}

export function DrillDrawer({
  drill,
  onClose,
}: {
  drill: Drill | null
  onClose: () => void
}) {
  const { t } = useI18n()

  useEffect(() => {
    if (!drill) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drill, onClose])

  if (!drill) return null

  return (
    <div className="fixed inset-0 z-[60] flex justify-end" data-print="hide">
      <button
        type="button"
        aria-label={t(ui.close)}
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={drill.title}
        className="relative flex h-full w-full max-w-md flex-col bg-surface-container-lowest shadow-xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-surface-container-high p-4">
          <div className="min-w-0">
            <div className="mb-1 flex flex-wrap items-center gap-1.5">
              {drill.ref && (
                <span className="font-mono font-label-sm text-label-sm text-on-surface-variant">
                  {drill.ref}
                </span>
              )}
              {drill.status && <Status tone={drill.tone ?? 'neutral'} label={drill.status} />}
            </div>
            <h2 className="font-headline-sm text-headline-sm leading-snug text-on-surface">
              {drill.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t(ui.close)}
            className="shrink-0 rounded p-1 text-on-surface-variant hover:bg-surface-container"
          >
            <Icon name="close" className="text-xl" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            {drill.facts.map((fact) => (
              <div key={t(fact.label)} className="flex flex-col gap-0.5">
                <dt className="font-label-sm text-label-sm text-on-surface-variant">
                  {t(fact.label)}
                </dt>
                <dd className="font-body-md text-body-md font-medium text-on-surface">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>

          {drill.officer && (
            <div className="mt-4 flex items-center justify-between gap-3 rounded-lg bg-surface-container p-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-label-md text-label-md font-bold text-on-primary">
                  {drill.officer.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-label-md text-label-md font-bold text-on-surface">
                    {drill.officer.name}
                  </p>
                  <p className="truncate font-label-sm text-label-sm text-on-surface-variant">
                    {t(drill.officer.designation)}
                  </p>
                </div>
              </div>
              <a
                href={`tel:${drill.officer.phone}`}
                className="inline-flex shrink-0 items-center gap-1.5 rounded bg-primary px-2.5 py-1.5 font-label-sm text-label-sm font-bold text-on-primary shadow-sm hover:bg-primary-container"
              >
                <Icon name="call" className="text-base" />
                {t(ui.callOfficer)}
              </a>
            </div>
          )}

          <div className="mt-4 rounded-lg border border-surface-container-high p-3">
            <p className="mb-1.5 flex items-center gap-1.5 font-label-sm text-label-sm font-bold tracking-wide text-on-surface-variant uppercase">
              <Icon name="history" className="text-sm" />
              {t(ui.auditTrail)}
            </p>
            <ul className="flex flex-col gap-1 font-body-sm text-body-sm text-on-surface-variant">
              <li>
                {t(ui.lastUpdated)}: <span className="text-on-surface">{drill.audit.updated}</span>
              </li>
              <li>
                {t(ui.updatedBy)}: <span className="text-on-surface">{drill.audit.by}</span>
              </li>
              <li>
                {t(ui.source)}:{' '}
                <span className="text-on-surface">{t(drill.audit.source)}</span>
              </li>
            </ul>
          </div>
        </div>

        <footer className="flex flex-wrap gap-2 border-t border-surface-container-high p-4">
          {(drill.actions ?? []).map((action) => (
            <Btn
              key={t(action.label)}
              label={action.label}
              icon={action.icon}
              variant={action.variant ?? 'secondary'}
            />
          ))}
          <Btn label={ui.viewFile} icon="folder_open" variant="primary" />
        </footer>
      </aside>
    </div>
  )
}
