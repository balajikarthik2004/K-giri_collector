import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Bi } from '../i18n'
import { SECTIONS, type RoleId, type SectionId } from './sections'

type AppCtx = {
  section: SectionId
  go: (section: SectionId) => void
  role: RoleId
  setRole: (role: RoleId) => void
  /** Sections the current role is allowed to open. */
  allowed: typeof SECTIONS
  toast: Bi | null
  notify: (message: Bi) => void
}

const Ctx = createContext<AppCtx | null>(null)

function readHash(): SectionId {
  const id = window.location.hash.replace('#', '') as SectionId
  return SECTIONS.some((section) => section.id === id) ? id : 'overview'
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [section, setSection] = useState<SectionId>(readHash)
  const [role, setRoleState] = useState<RoleId>('collector')
  const [toast, setToast] = useState<Bi | null>(null)

  useEffect(() => {
    const onHash = () => setSection(readHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const go = useCallback((next: SectionId) => {
    window.location.hash = next
    setSection(next)
    window.scrollTo({ top: 0 })
  }, [])

  const notify = useCallback((message: Bi) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2600)
  }, [])

  const allowed = useMemo(
    () => SECTIONS.filter((item) => item.roles.includes(role)),
    [role],
  )

  // A role change can strand the user on a section outside the new jurisdiction,
  // so redirect as part of the switch rather than in an effect afterwards.
  const setRole = useCallback(
    (next: RoleId) => {
      setRoleState(next)
      const permitted = SECTIONS.filter((item) => item.roles.includes(next))
      if (!permitted.some((item) => item.id === readHash())) go('overview')
    },
    [go],
  )

  const value = useMemo<AppCtx>(
    () => ({ section, go, role, setRole, allowed, toast, notify }),
    [section, go, role, setRole, allowed, toast, notify],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
