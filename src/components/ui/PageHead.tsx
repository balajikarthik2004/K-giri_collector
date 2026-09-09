import type { ReactNode } from 'react'
import { Icon } from '../Icon'
import { useI18n, type Bi } from '../../i18n'

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

      {filters && (
        <div
          className="flex shrink-0 flex-wrap items-center justify-end gap-1.5"
          data-print="hide"
        >
          {filters}
        </div>
      )}
    </header>
  )
}
