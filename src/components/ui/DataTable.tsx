import { useMemo, useState, type ReactNode } from 'react'
import { Icon } from '../Icon'
import { useI18n, type Bi } from '../../i18n'
import { ui } from '../../i18n/ui'
import { Btn } from './Primitives'

export type Column<R> = {
  key: string
  head: Bi
  /** Rich cell. Falls back to text() when absent. */
  render?: (row: R) => ReactNode
  /** Plain text — powers search, CSV export and the mobile card layout. */
  text: (row: R) => string
  align?: 'left' | 'right'
  /** Dropped from the mobile card layout to keep it scannable. */
  minor?: boolean
}

function downloadCsv<R>(name: string, columns: Column<R>[], rows: R[], head: (c: Column<R>) => string) {
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`
  const csv = [
    columns.map((column) => escape(head(column))).join(','),
    ...rows.map((row) => columns.map((column) => escape(column.text(row))).join(',')),
  ].join('\r\n')

  const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${name}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export function DataTable<R>({
  columns,
  rows,
  rowKey,
  onRowClick,
  searchable = true,
  exportName,
  empty,
  dense = false,
}: {
  columns: Column<R>[]
  rows: R[]
  rowKey: (row: R) => string
  onRowClick?: (row: R) => void
  searchable?: boolean
  exportName?: string
  empty?: Bi
  dense?: boolean
}) {
  const { t } = useI18n()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return rows
    return rows.filter((row) =>
      columns.some((column) => column.text(row).toLowerCase().includes(needle)),
    )
  }, [columns, query, rows])

  return (
    <div className="flex flex-col gap-2">
      {(searchable || exportName) && (
        <div className="flex items-center gap-2" data-print="hide">
          {searchable && (
            <div className="relative flex min-w-0 flex-1 items-center">
              <Icon
                name="search"
                className="pointer-events-none absolute left-2 text-base text-on-surface-variant"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t(ui.searchShort)}
                aria-label={t(ui.searchShort)}
                className="h-8 w-full rounded bg-surface-container-low pr-2 pl-8 font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:bg-surface-container focus:outline-none"
              />
            </div>
          )}
          {exportName && (
            <Btn
              icon="download"
              label={ui.exportCsv}
              onClick={() => downloadCsv(exportName, columns, filtered, (c) => t(c.head))}
            />
          )}
        </div>
      )}

      {/* Desktop / tablet */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-2.5 py-2 font-label-sm text-label-sm font-bold tracking-wide text-on-surface-variant uppercase ${
                    column.align === 'right' ? 'text-right' : ''
                  }`}
                >
                  {t(column.head)}
                </th>
              ))}
              {onRowClick && <th className="w-8" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {filtered.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`transition-colors ${
                  onRowClick ? 'cursor-pointer hover:bg-surface-container-low' : ''
                }`}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-2.5 align-middle font-body-sm text-body-sm text-on-surface ${
                      dense ? 'py-1.5' : 'py-2.5'
                    } ${column.align === 'right' ? 'text-right tabular-nums' : ''}`}
                  >
                    {column.render ? column.render(row) : column.text(row)}
                  </td>
                ))}
                {onRowClick && (
                  <td className="pr-2 text-right">
                    <Icon name="chevron_right" className="text-base text-on-surface-variant" />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card layout — the Collector reads this in the car */}
      <ul className="flex flex-col gap-2 md:hidden">
        {filtered.map((row) => {
          const [first, ...rest] = columns
          const Card = onRowClick ? 'button' : 'div'
          return (
            <li key={rowKey(row)}>
              <Card
                {...(onRowClick ? { type: 'button' as const, onClick: () => onRowClick(row) } : {})}
                className="w-full rounded bg-surface-container-low p-2.5 text-left"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-label-md text-label-md font-bold text-on-surface">
                    {first.render ? first.render(row) : first.text(row)}
                  </span>
                  {onRowClick && (
                    <Icon name="chevron_right" className="text-base text-on-surface-variant" />
                  )}
                </div>
                <dl className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-1">
                  {rest
                    .filter((column) => !column.minor)
                    .map((column) => (
                      <div key={column.key} className="flex flex-col">
                        <dt className="font-label-sm text-label-sm text-on-surface-variant">
                          {t(column.head)}
                        </dt>
                        <dd className="font-body-sm text-body-sm text-on-surface">
                          {column.render ? column.render(row) : column.text(row)}
                        </dd>
                      </div>
                    ))}
                </dl>
              </Card>
            </li>
          )
        })}
      </ul>

      {filtered.length === 0 && (
        <p className="rounded bg-surface-container-low px-3 py-6 text-center font-body-sm text-body-sm text-on-surface-variant">
          {t(empty ?? ui.noResults)}
        </p>
      )}
    </div>
  )
}
