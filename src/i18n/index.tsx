import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Lang = 'en' | 'ta'

/** A bilingual string. Every piece of copy in the app is one of these. */
export type Bi = { en: string; ta: string }

/** Terse constructor so data files stay readable: bi('Pending', 'நிலுவை'). */
export const bi = (en: string, ta: string): Bi => ({ en, ta })

type Ctx = {
  lang: Lang
  setLang: (lang: Lang) => void
  /** Resolve a bilingual string to the active language. */
  t: (value: Bi | string) => string
}

const I18nContext = createContext<Ctx | null>(null)
const STORAGE_KEY = 'kgiri.lang.v2'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    return stored === 'en' || stored === 'ta' ? stored : 'en'
  })

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* private mode — language simply resets next visit */
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t: (value) => (typeof value === 'string' ? value : value[lang]),
    }),
    [lang, setLang],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>')
  return ctx
}

/** Indian-format grouping (1,42,830) — digits stay Latin in both languages. */
export function num(value: number, digits = 0) {
  return value.toLocaleString('en-IN', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

/** ₹ in crore / lakh, the unit district reviews actually speak in. */
export function inr(croreValue: number) {
  return croreValue >= 1
    ? `₹${num(croreValue, 2)} Cr`
    : `₹${num(croreValue * 100, 1)} L`
}

export function pct(value: number, digits = 1) {
  return `${num(value, digits)}%`
}
