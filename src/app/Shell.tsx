import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Icon } from '../components/Icon'
import { bi, useI18n } from '../i18n'
import { ui, roles as roleNames } from '../i18n/ui'
import { EMBLEM_SRC, PORTRAIT_FACE_CROP, PORTRAIT_SRC } from '../data/portal'
import { ITEMS as ACTION_ITEMS } from '../data/actions'
import { searchAll } from '../data/search'
import { GROUP_ORDER, ROLE_SCOPE, type RoleId, type SectionId } from './sections'
import { useApp } from './store'

const ROLE_IDS: RoleId[] = ['collector', 'rdo', 'bdo', 'tahsildar', 'hod']

const IST_TIME = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kolkata',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

function useClock() {
  const [now, setNow] = useState(() => IST_TIME.format(new Date()))
  useEffect(() => {
    const id = window.setInterval(() => setNow(IST_TIME.format(new Date())), 30_000)
    return () => window.clearInterval(id)
  }, [])
  return now
}

/* ------------------------------------------------------------------ *
 * Role control — the jurisdiction sits under the role, with a native
 * select on top so keyboard and screen-reader behaviour stay standard.
 * ------------------------------------------------------------------ */

function RoleControl() {
  const { t } = useI18n()
  const { role, setRole } = useApp()

  return (
    <div className="chrome-chip relative flex items-center gap-2 rounded py-1 pr-1.5 pl-2.5">
      <Icon name="switch_account" className="shrink-0 text-base text-secondary-fixed-dim" />
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="truncate font-label-sm text-label-sm font-bold text-white">
          {t(roleNames[role])}
        </span>
        <span className="truncate font-label-sm text-[0.625rem] text-white/60">
          {t(ROLE_SCOPE[role])}
        </span>
      </span>
      {role !== 'collector' && (
        <Icon name="filter_alt" className="shrink-0 text-sm text-secondary-fixed-dim" />
      )}
      <Icon name="expand_more" className="shrink-0 text-base text-white/55" />
      <select
        value={role}
        onChange={(event) => setRole(event.target.value as RoleId)}
        aria-label={t(ui.role)}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        {ROLE_IDS.map((id) => (
          <option key={id} value={id}>
            {t(roleNames[id])}
          </option>
        ))}
      </select>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Navigation, shared by the desktop rail and the mobile sheet.
 * ------------------------------------------------------------------ */

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useI18n()
  const { allowed, section, go } = useApp()

  return (
    <nav className="flex flex-col gap-3">
      {GROUP_ORDER.map((group) => {
        const items = allowed.filter((item) => t(item.group) === t(group))
        if (items.length === 0) return null
        return (
          <div key={t(group)} className="flex flex-col gap-0.5">
            <p className="rail-group px-2.5 pb-1.5 font-label-sm text-[0.625rem] font-bold tracking-[0.14em] uppercase">
              {t(group)}
            </p>
            {items.map((item) => {
              const active = item.id === section
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-current={active ? 'page' : undefined}
                  onClick={() => {
                    go(item.id as SectionId)
                    onNavigate?.()
                  }}
                  className={`nav-item relative flex items-center gap-2.5 rounded px-2.5 py-2 text-left ${
                    active
                      ? 'rule-accent nav-active font-bold text-on-primary'
                      : 'text-[#4c3b33] hover:text-primary'
                  }`}
                >
                  <Icon name={item.icon} className="shrink-0 text-lg" />
                  <span className="min-w-0 flex-1 truncate font-label-md text-label-md">
                    {t(item.label)}
                  </span>
                  {item.badge !== undefined && (
                    <span
                      className={`shrink-0 rounded-full px-1.5 py-px font-label-sm text-label-sm font-bold tabular-nums ${
                        active
                          ? 'bg-on-primary/20 text-on-primary'
                          : item.badgeTone === 'critical'
                            ? 'bg-crit/12 text-crit'
                            : 'bg-warning/25 text-[#6b4a00]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )
      })}
    </nav>
  )
}

/* ------------------------------------------------------------------ *
 * Masthead search — resolves a reference, petitioner, village, taluk or
 * officer to the section holding it. ⌘K / Ctrl-K focuses it.
 * ------------------------------------------------------------------ */

function Search() {
  const { t } = useI18n()
  const { go } = useApp()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const boxRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const hits = useMemo(() => searchAll(query), [query])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const onDown = (event: MouseEvent) => {
      if (!boxRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const choose = (hit: (typeof hits)[number]) => {
    go(hit.section)
    setOpen(false)
    setQuery('')
    inputRef.current?.blur()
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
      return
    }
    if (hits.length === 0) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((index) => (index + 1) % hits.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((index) => (index - 1 + hits.length) % hits.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      choose(hits[active])
    }
  }

  const showPanel = open && query.trim().length > 0

  return (
    <div ref={boxRef} className="relative mx-auto hidden max-w-xl flex-1 items-center lg:flex">
      <Icon name="search" className="pointer-events-none absolute left-3 text-lg text-white/55" />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setActive(0)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder={t(ui.search)}
        aria-label={t(ui.searchShort)}
        aria-expanded={showPanel}
        aria-controls="masthead-search-results"
        role="combobox"
        autoComplete="off"
        className="chrome-chip h-9 w-full appearance-none rounded pr-16 pl-9 font-body-sm text-body-sm text-white placeholder:text-white/55 focus:border-secondary-fixed-dim/70 focus:bg-[rgba(255,255,255,0.17)] focus:outline-none"
      />
      <kbd className="pointer-events-none absolute right-2.5 rounded border border-white/15 bg-white/10 px-1.5 py-0.5 font-mono text-[0.625rem] font-semibold text-white/60">
        ⌘K
      </kbd>

      {showPanel && (
        <div
          id="masthead-search-results"
          role="listbox"
          className="absolute top-11 right-0 left-0 z-50 overflow-hidden rounded-lg border border-hairline bg-surface-container-lowest shadow-2xl"
        >
          {hits.length === 0 ? (
            <p className="px-3 py-3 font-body-sm text-body-sm text-on-surface-variant">
              {t(ui.noResults)} “{query}”
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {hits.map((hit, index) => (
                <li key={hit.key}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={index === active}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => choose(hit)}
                    className={`flex w-full items-center gap-2.5 px-3 py-2 text-left ${
                      index === active ? 'bg-surface-container' : ''
                    }`}
                  >
                    <Icon name={hit.icon} className="shrink-0 text-lg text-primary" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-label-md text-label-md font-bold text-on-surface">
                        {hit.title}
                      </span>
                      <span className="block truncate font-body-sm text-body-sm text-on-surface-variant">
                        {hit.subtitle}
                      </span>
                    </span>
                    <span className="shrink-0 rounded bg-surface-container-high px-1.5 py-0.5 font-label-sm text-[0.625rem] font-bold text-on-surface-variant">
                      {t(hit.kind)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Profile — the chip opens the official portrait; clicking anywhere
 * outside it, or pressing Escape, closes it again.
 * ------------------------------------------------------------------ */

function ProfileMenu() {
  const { t } = useI18n()
  const { role } = useApp()
  const [open, setOpen] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (event: MouseEvent) => {
      if (!boxRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={boxRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="dialog"
        title={t(ui.collector)}
        className={`flex shrink-0 items-center gap-2 rounded py-0.5 pr-1 pl-0.5 text-left transition-colors hover:bg-white/12 ${
          open ? 'bg-white/12' : ''
        }`}
      >
        <span
          role="img"
          aria-label={t(ui.collector)}
          style={PORTRAIT_FACE_CROP}
          className="h-9 w-9 shrink-0 rounded-full ring-2 ring-secondary-fixed-dim/70 ring-offset-1 ring-offset-[#4d040d]"
        />
        <span className="hidden flex-col leading-tight 2xl:flex">
          <span className="font-label-sm text-label-sm font-bold text-white">
            {t(ui.collector)}
          </span>
          <span className="font-label-sm text-[0.625rem] text-white/60">
            {t(ui.collectorRole)}
          </span>
        </span>
        <Icon name="expand_more" className="hidden shrink-0 text-base text-white/55 2xl:block" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={t(ui.collector)}
          className="absolute top-12 right-0 z-50 w-72 overflow-hidden rounded-lg border border-hairline bg-surface-container-lowest shadow-2xl"
        >
          <img
            src={PORTRAIT_SRC}
            alt={t(ui.collector)}
            className="block aspect-[4/3] w-full object-cover object-top"
          />
          <div className="flex flex-col gap-2 p-3">
            <div>
              <p className="font-label-md text-label-md font-bold text-on-surface">
                {t(ui.collector)}
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {t(ui.collectorRole)}
              </p>
            </div>
            <dl className="flex flex-col gap-1 border-t border-hairline pt-2">
              <div className="flex items-baseline justify-between gap-2">
                <dt className="font-label-sm text-label-sm text-on-surface-variant">
                  {t(ui.role)}
                </dt>
                <dd className="font-label-sm text-label-sm font-bold text-on-surface">
                  {t(roleNames[role])}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <dt className="font-label-sm text-label-sm text-on-surface-variant">
                  {t(bi('Jurisdiction', 'எல்லை'))}
                </dt>
                <dd className="font-label-sm text-label-sm font-bold text-on-surface">
                  {t(ROLE_SCOPE[role])}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Shell
 * ------------------------------------------------------------------ */

function Divider() {
  return <span aria-hidden="true" className="mx-0.5 h-7 w-px bg-white/15" />
}

export function Shell({ children }: { children: ReactNode }) {
  const { t, lang, setLang } = useI18n()
  const { toast, go } = useApp()
  const [navOpen, setNavOpen] = useState(false)
  const clock = useClock()

  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [navOpen])

  return (
    <div className="min-h-screen bg-background">
      {/* ================= Masthead ================= */}
      <header
        className="chrome-topbar chrome-rule fixed top-0 right-0 left-0 z-50 flex h-14 items-center gap-2 px-3 lg:h-16 lg:gap-3 lg:px-4"
        data-print="hide"
      >
        {/* Hairline highlight along the very top edge */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/5 via-white/30 to-white/5"
        />

        <button
          type="button"
          onClick={() => setNavOpen(true)}
          aria-label={t(ui.menu)}
          className="-ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded text-white/85 transition-colors hover:bg-white/12 hover:text-white lg:hidden"
        >
          <Icon name="menu" className="text-xl" />
        </button>

        {/* Identity */}
        <button
          type="button"
          onClick={() => go('overview')}
          className="flex min-w-0 shrink items-center gap-2.5 text-left"
        >
          <img
            src={EMBLEM_SRC}
            alt=""
            className="emblem-plate h-9 w-9 shrink-0 rounded-full object-cover p-0.5 lg:h-10 lg:w-10"
          />
          <span className="flex min-w-0 flex-col">
            <span className="truncate font-headline-sm text-[0.9375rem] leading-tight font-bold tracking-tight text-white lg:text-[1.0625rem]">
              {t(ui.appName)}
            </span>
            <span className="hidden truncate font-label-sm text-[0.625rem] tracking-[0.1em] text-secondary-fixed-dim uppercase sm:block">
              {t(ui.appSub)}
            </span>
          </span>
        </button>

        {/* Search */}
        <Search />

        {/* Utilities */}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="hidden flex-col items-end leading-tight xl:flex">
            <span className="font-label-sm text-label-sm font-bold tabular-nums text-white">
              {clock} <span className="text-white/55">IST</span>
            </span>
            <span className="font-label-sm text-[0.625rem] text-white/55">
              {t(ui.briefingDate)}
            </span>
          </span>

          <span className="hidden xl:block">
            <Divider />
          </span>

          <div className="hidden md:block">
            <RoleControl />
          </div>

          <div className="chrome-chip flex items-center rounded p-0.5">
            {(['ta', 'en'] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                className={`rounded px-2 py-1 font-label-sm text-label-sm font-bold transition-colors ${
                  lang === code
                    ? 'gold-pill text-on-secondary-fixed'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {code === 'ta' ? 'தமிழ்' : 'EN'}
              </button>
            ))}
          </div>

          <Divider />

          <button
            type="button"
            onClick={() => go('actions')}
            title={t(ui.actionQueue)}
            aria-label={t(ui.actionQueue)}
            className="relative flex h-9 w-9 items-center justify-center rounded text-white/85 transition-colors hover:bg-white/12 hover:text-white"
          >
            <Icon name="notifications" className="text-xl" />
            <span className="gold-pill absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 font-label-sm text-[0.625rem] font-bold text-on-secondary-fixed">
              {ACTION_ITEMS.length}
            </span>
          </button>

          <Divider />

          <ProfileMenu />
        </div>
      </header>

      {/* ================= Desktop rail ================= */}
      <aside
        className="rail fixed top-16 bottom-0 left-0 z-40 hidden w-64 flex-col overflow-y-auto border-r border-hairline px-2.5 py-4 lg:flex"
        data-print="hide"
      >
        <NavList />
      </aside>

      {/* ================= Mobile nav sheet ================= */}
      {navOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden" data-print="hide">
          <button
            type="button"
            aria-label={t(ui.close)}
            onClick={() => setNavOpen(false)}
            className="absolute inset-0 bg-black/45"
          />
          <div className="rail relative flex h-full w-72 max-w-[85vw] flex-col overflow-y-auto shadow-2xl">
            <div className="chrome flex items-center justify-between px-3 py-3">
              <span className="flex items-center gap-2">
                <img
                  src={EMBLEM_SRC}
                  alt=""
                  className="emblem-plate h-8 w-8 rounded-full object-cover p-0.5"
                />
                <span className="font-label-md text-label-md font-bold text-white">
                  {t(ui.appName)}
                </span>
              </span>
              <button
                type="button"
                onClick={() => setNavOpen(false)}
                aria-label={t(ui.close)}
                className="rounded p-1 text-white/80 hover:bg-white/12 hover:text-white"
              >
                <Icon name="close" className="text-xl" />
              </button>
            </div>
            <div className="chrome px-3 pb-3">
              <RoleControl />
            </div>
            <div className="p-3">
              <NavList onNavigate={() => setNavOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* ================= Content ================= */}
      <div className="lg:pl-64" data-print="shell">
        <main className="mx-auto w-full max-w-[112rem] px-3 pt-[4.5rem] pb-20 lg:px-4 lg:pt-[5.25rem] lg:pb-10">
          {children}
        </main>
      </div>

      {/* ================= Mobile quick bar ================= */}
      <nav
        className="fixed right-0 bottom-0 left-0 z-40 flex items-center justify-around border-t border-hairline bg-surface-container-lowest/95 py-1.5 backdrop-blur-sm lg:hidden"
        data-print="hide"
      >
        {(
          [
            { id: 'overview', icon: 'overview', label: ui.today },
            { id: 'actions', icon: 'priority_high', label: ui.actionQueue },
            { id: 'maps', icon: 'map', label: ui.mapView },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => go(item.id)}
            className="flex flex-col items-center gap-0.5 px-3 py-0.5 text-on-surface-variant"
          >
            <Icon name={item.icon} className="text-xl" />
            <span className="font-label-sm text-[0.625rem]">{t(item.label)}</span>
          </button>
        ))}
      </nav>

      {/* ================= Toast ================= */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-20 left-1/2 z-[80] -translate-x-1/2 rounded bg-inverse-surface px-3 py-2 font-label-sm text-label-sm text-inverse-on-surface shadow-lg lg:bottom-6"
          data-print="hide"
        >
          {t(toast)}
        </div>
      )}
    </div>
  )
}
