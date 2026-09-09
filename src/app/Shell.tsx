import { useEffect, useState, type ReactNode } from 'react'
import { Icon } from '../components/Icon'
import { useI18n } from '../i18n'
import { ui, roles as roleNames } from '../i18n/ui'
import { EMBLEM_SRC, PORTRAIT_SRC } from '../data/portal'
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
    <div className="relative flex items-center gap-2 rounded border border-white/18 bg-white/10 py-1 pr-1.5 pl-2.5 transition-colors hover:border-secondary-fixed-dim/50 hover:bg-white/16">
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
            <p className="px-2.5 pb-1.5 font-label-sm text-[0.625rem] font-bold tracking-[0.14em] text-outline uppercase">
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
                  className={`relative flex items-center gap-2.5 rounded px-2.5 py-2 text-left transition-colors ${
                    active
                      ? 'rule-accent bg-primary font-bold text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
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
 * Shell
 * ------------------------------------------------------------------ */

function Divider() {
  return <span aria-hidden="true" className="mx-0.5 h-7 w-px bg-white/15" />
}

export function Shell({ children }: { children: ReactNode }) {
  const { t, lang, setLang } = useI18n()
  const { toast, notify, go } = useApp()
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
        className="chrome chrome-rule fixed top-0 right-0 left-0 z-50 flex h-14 items-center gap-2 px-3 lg:h-16 lg:gap-3 lg:px-4"
        data-print="hide"
      >
        {/* Hairline highlight along the very top edge */}
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-white/15" />

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
            className="h-9 w-9 shrink-0 rounded-full bg-white p-0.5 shadow-[0_1px_3px_rgba(0,0,0,0.35)] ring-1 ring-secondary-fixed-dim/50 lg:h-10 lg:w-10"
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
        <div className="relative mx-auto hidden max-w-xl flex-1 items-center lg:flex">
          <Icon
            name="search"
            className="pointer-events-none absolute left-3 text-lg text-white/55"
          />
          <input
            type="search"
            placeholder={t(ui.search)}
            aria-label={t(ui.searchShort)}
            className="h-9 w-full appearance-none rounded border border-white/18 bg-[rgba(255,255,255,0.1)] pr-16 pl-9 font-body-sm text-body-sm text-white transition-colors placeholder:text-white/55 focus:border-secondary-fixed-dim/70 focus:bg-[rgba(255,255,255,0.17)] focus:outline-none"
          />
          <kbd className="pointer-events-none absolute right-2.5 rounded border border-white/15 bg-white/10 px-1.5 py-0.5 font-mono text-[0.625rem] font-semibold text-white/60">
            ⌘K
          </kbd>
        </div>

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

          <div className="flex items-center rounded border border-white/18 bg-white/10 p-0.5">
            {(['ta', 'en'] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                className={`rounded px-2 py-1 font-label-sm text-label-sm font-bold transition-colors ${
                  lang === code
                    ? 'bg-secondary-fixed-dim text-on-secondary-fixed shadow-sm'
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
            onClick={() => window.print()}
            title={t(ui.print)}
            aria-label={t(ui.print)}
            className="hidden h-9 w-9 items-center justify-center rounded text-white/85 transition-colors hover:bg-white/12 hover:text-white sm:flex"
          >
            <Icon name="print" className="text-xl" />
          </button>

          <button
            type="button"
            onClick={() => go('actions')}
            title={t(ui.actionQueue)}
            aria-label={t(ui.actionQueue)}
            className="relative flex h-9 w-9 items-center justify-center rounded text-white/85 transition-colors hover:bg-white/12 hover:text-white"
          >
            <Icon name="notifications" className="text-xl" />
            <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary-fixed-dim px-1 font-label-sm text-[0.625rem] font-bold text-on-secondary-fixed">
              18
            </span>
          </button>

          <Divider />

          <button
            type="button"
            className="flex shrink-0 items-center gap-2 rounded py-0.5 pr-1 pl-0.5 text-left transition-colors hover:bg-white/12"
          >
            <img
              src={PORTRAIT_SRC}
              alt={t(ui.collector)}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-secondary-fixed-dim/60"
            />
            <span className="hidden flex-col leading-tight 2xl:flex">
              <span className="font-label-sm text-label-sm font-bold text-white">
                {t(ui.collector)}
              </span>
              <span className="font-label-sm text-[0.625rem] text-white/60">
                {t(ui.collectorRole)}
              </span>
            </span>
          </button>
        </div>
      </header>

      {/* ================= Desktop rail ================= */}
      <aside
        className="fixed top-16 bottom-0 left-0 z-40 hidden w-64 flex-col justify-between overflow-y-auto border-r border-hairline bg-surface-container-lowest px-2.5 py-4 lg:flex"
        data-print="hide"
      >
        <NavList />
        <div className="mt-4 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex w-full items-center justify-center gap-1.5 rounded border border-hairline bg-surface-container-low py-2 font-label-sm text-label-sm font-bold text-primary hover:bg-surface-container"
          >
            <Icon name="picture_as_pdf" className="text-base" />
            {t(ui.print)}
          </button>
          <a
            href="tel:1077"
            className="flex w-full items-center justify-center gap-1.5 rounded bg-error py-2 font-label-sm text-label-sm font-bold text-on-error shadow-sm hover:opacity-95"
          >
            <Icon name="emergency" className="text-base" />
            1077
          </a>
        </div>
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
          <div className="relative flex h-full w-72 max-w-[85vw] flex-col overflow-y-auto bg-surface-container-lowest shadow-2xl">
            <div className="chrome flex items-center justify-between px-3 py-3">
              <span className="flex items-center gap-2">
                <img src={EMBLEM_SRC} alt="" className="h-8 w-8 rounded-full bg-white p-0.5" />
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
        <button
          type="button"
          onClick={() => notify(ui.pushed)}
          className="flex flex-col items-center gap-0.5 px-3 py-0.5 text-on-surface-variant"
        >
          <Icon name="ios_share" className="text-xl" />
          <span className="font-label-sm text-[0.625rem]">{t(ui.pushMobile)}</span>
        </button>
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
