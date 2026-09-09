import { bi, type Bi } from '../i18n'
import { SECTIONS, type SectionId } from '../app/sections'
import { ITEMS as ACTION_ITEMS, KIND_LABEL } from './actions'
import { PETITIONS } from './petitions'
import { BLOCKS, TALUK_DESKS, TALUK_IDS, TALUKS } from './common'

export type Hit = {
  /** Stable key for the result list. */
  key: string
  /** What the row is — "Petition", "Taluk", shown as a chip. */
  kind: Bi
  icon: string
  title: string
  subtitle: string
  /** Section to open when the row is chosen. */
  section: SectionId
  /**
   * Everything this row can be found by, both languages, already lowercased.
   * Built once at module load.
   */
  haystack: string
}

const KIND = {
  section: bi('Section', 'பிரிவு'),
  petition: bi('Petition', 'மனு'),
  taluk: bi('Taluk', 'வட்டம்'),
  block: bi('Block', 'ஒன்றியம்'),
  officer: bi('Officer', 'அலுவலர்'),
}

const norm = (value: string) => value.toLowerCase().replace(/\s+/g, ' ').trim()
const both = (value: Bi) => `${value.en} ${value.ta}`

/**
 * A flat index over everything the masthead search can reach. It is assembled
 * from the same modules the pages render, so a result can never point at a
 * record that is not there.
 */
export const SEARCH_INDEX: Hit[] = [
  ...SECTIONS.map((section) => ({
    key: `section-${section.id}`,
    kind: KIND.section,
    icon: section.icon,
    title: section.label.en,
    subtitle: section.group.en,
    section: section.id,
    haystack: norm(`${both(section.label)} ${both(section.group)}`),
  })),

  ...PETITIONS.map((petition) => ({
    key: `petition-${petition.id}`,
    kind: KIND.petition,
    icon: 'mark_email_unread',
    title: petition.id,
    subtitle: `${petition.subject.en} · ${petition.village.en}`,
    section: 'grievances' as SectionId,
    haystack: norm(
      [
        petition.id,
        both(petition.subject),
        petition.petitioner,
        petition.mobile,
        both(petition.village),
        both(petition.dept),
        both(petition.channel),
        petition.officer,
      ].join(' '),
    ),
  })),

  ...ACTION_ITEMS.map((item) => ({
    key: `action-${item.id}`,
    kind: KIND_LABEL[item.kind],
    icon: 'priority_high',
    title: item.ref,
    subtitle: item.title.en,
    section: 'actions' as SectionId,
    haystack: norm(
      [item.ref, both(item.title), both(item.detail), item.owner].join(' '),
    ),
  })),

  ...TALUK_IDS.map((id) => ({
    key: `taluk-${id}`,
    kind: KIND.taluk,
    icon: 'map',
    title: TALUKS[id].en,
    subtitle: `Tahsildar ${TALUK_DESKS[id].name}`,
    section: 'maps' as SectionId,
    haystack: norm(`${both(TALUKS[id])} ${TALUK_DESKS[id].name} ${TALUK_DESKS[id].phone}`),
  })),

  ...BLOCKS.map((block) => ({
    key: `block-${block.en}`,
    kind: KIND.block,
    icon: 'grid_view',
    title: block.en,
    subtitle: 'Panchayat union',
    section: 'maps' as SectionId,
    haystack: norm(both(block)),
  })),

  ...TALUK_IDS.map((id) => ({
    key: `officer-${id}`,
    kind: KIND.officer,
    icon: 'badge',
    title: TALUK_DESKS[id].name,
    subtitle: `Tahsildar, ${TALUKS[id].en}`,
    section: 'revenue' as SectionId,
    haystack: norm(`${TALUK_DESKS[id].name} ${both(TALUKS[id])} ${TALUK_DESKS[id].phone}`),
  })),
]

/**
 * Every whitespace-separated term must appear somewhere in the row, so
 * "hosur patta" narrows rather than widens. Rows whose title starts with the
 * query sort first, which puts an exact reference number at the top.
 */
export function searchAll(query: string, limit = 8): Hit[] {
  const terms = norm(query).split(' ').filter(Boolean)
  if (terms.length === 0) return []

  const matches = SEARCH_INDEX.filter((hit) => terms.every((term) => hit.haystack.includes(term)))

  const head = norm(query)
  return matches
    .sort((a, b) => {
      const aStarts = norm(a.title).startsWith(head) ? 0 : 1
      const bStarts = norm(b.title).startsWith(head) ? 0 : 1
      if (aStarts !== bStarts) return aStarts - bStarts
      return a.title.localeCompare(b.title)
    })
    .slice(0, limit)
}
