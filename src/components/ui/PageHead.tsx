import type { ReactNode } from 'react'
import { Icon } from '../Icon'
import { useI18n, type Bi } from '../../i18n'
import { ui } from '../../i18n/ui'
import { useApp } from '../../app/store'

export function PageHead({
  title,
  note,
  icon,
  filters,
}: {
  title: Bi
  note: Bi
  icon: string
  filters?: ReactNode
}) {
  const { t } = useI18n()
  const { notify } = useApp()

  return (
    <header className="flex flex-col gap-3 border-b border-hairline pb-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[linear-gradient(140deg,#7b1e23,#4a040d)] text-on-primary shadow-sm ring-1 ring-black/5">
          <Icon name={icon} className="text-[1.375rem]" />
        </span>
        <div className="min-w-0">
          <h1 className="font-headline-md text-[1.1875rem] leading-6 font-bold tracking-tight text-on-surface lg:text-[1.5rem] lg:leading-8">
            {t(title)}
          </h1>
          <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">{t(note)}</p>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5" data-print="hide">
        {filters}
        <button
          type="button"
          onClick={() => notify(ui.pushed)}
          title={t(ui.pushMobile)}
          aria-label={t(ui.pushMobile)}
          className="rounded bg-surface-container p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
        >
          <Icon name="smartphone" className="text-base" />
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded bg-primary px-2.5 py-2 font-label-sm text-label-sm font-bold text-on-primary shadow-sm hover:bg-primary-container"
        >
          <Icon name="print" className="text-base" />
          <span className="hidden sm:inline">{t(ui.print)}</span>
        </button>
      </div>
    </header>
  )
}
