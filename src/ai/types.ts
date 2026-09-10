import type { Bi } from '../i18n'
import type { SectionId } from '../app/sections'
import type { Tone } from '../components/ui/Primitives'
import type { BarDatum, ColumnDatum, LineSeries } from '../components/ui/Charts'

/* ------------------------------------------------------------------ *
 * Answer blocks — the vocabulary the assistant is allowed to reply in.
 *
 * An answer is never free text with a chart bolted on: it is an ordered
 * list of these, so every reply is composed of the same reviewed parts
 * the rest of the portal renders, and a reply can never show a figure
 * in a shape the design system has not validated.
 * ------------------------------------------------------------------ */

export type Block =
  | { kind: 'text'; body: Bi }
  | {
      kind: 'stats'
      items: {
        label: Bi
        value: string
        unit?: string
        delta?: string
        deltaTone?: 'good' | 'bad' | 'neutral'
        meter?: number
        meterTone?: 'primary' | 'good' | 'warning' | 'critical' | 'viz-1'
        footnote?: Bi
      }[]
    }
  | { kind: 'bullets'; title?: Bi; items: { tone: Tone; label: Bi; note?: Bi }[] }
  | { kind: 'callout'; tone: Tone; title: Bi; body: Bi }
  | {
      kind: 'column'
      title: Bi
      note?: Bi
      data: ColumnDatum[]
      seriesA: Bi
      seriesB?: Bi
      unit?: string
    }
  | { kind: 'bars'; title: Bi; note?: Bi; data: BarDatum[]; unit?: string }
  | {
      kind: 'line'
      title: Bi
      note?: Bi
      labels: Bi[]
      series: LineSeries[]
      band?: { upper: number[]; lower: number[]; label?: Bi }
      unit?: string
      height?: number
    }
  | {
      kind: 'donut'
      title: Bi
      note?: Bi
      data: { label: Bi; value: number }[]
      centerValue: string
      centerLabel: Bi
    }
  | { kind: 'heatmap'; title: Bi; note?: Bi; columns: Bi[]; rows: { label: Bi; values: number[] }[]; legend?: Bi }
  | {
      kind: 'table'
      title: Bi
      note?: Bi
      columns: { head: Bi; align?: 'left' | 'right' }[]
      rows: { cells: (Bi | string)[]; tone?: Tone; status?: Bi }[]
    }
  | { kind: 'officer'; name: string; designation: Bi; phone: string; holding: Bi }
  | { kind: 'doc'; title: Bi; meta: Bi; paragraphs: Bi[] }
  | { kind: 'query'; dialect: string; sql: string; rows: number; ms: number }

/* ------------------------------------------------------------------ *
 * A composed answer.
 * ------------------------------------------------------------------ */

export type Citation = { source: Bi; asOf: Bi; rows: number }

export type AnswerAction = {
  label: Bi
  icon: string
  /** Confirmation shown as a toast — the assistant proposes, a human commits. */
  toast: Bi
  variant?: 'primary' | 'accent' | 'secondary' | 'danger'
}

export type Answer = {
  /** The streamed opening paragraph — the part a Collector reads first. */
  summary: Bi
  blocks: Block[]
  citations: Citation[]
  /** 0–1. Shown as a labelled band, never as a bare number. */
  confidence: number
  /** Records the retrieval step touched, for the trust line. */
  scanned: number
  followUps: Bi[]
  actions?: AnswerAction[]
  /** Module this answer came out of — offered as "open the module". */
  section?: SectionId
  /** Retrieval steps for this specific question, shown while it works. */
  plan?: Bi[]
}

/* ------------------------------------------------------------------ *
 * Intents — a scored keyword match, then a composed answer. The whole
 * catalogue is grounded in the same records the modules render.
 * ------------------------------------------------------------------ */

export type Intent = {
  id: string
  /** Terms in both languages. A phrase (with a space) scores double. */
  keys: string[]
  /** Roles that may see the answer; others get a scope notice. */
  roles?: string[]
  answer: Answer
}

/* ------------------------------------------------------------------ *
 * Conversation state.
 * ------------------------------------------------------------------ */

export type Stage = { label: Bi; ms: number }

export type Turn =
  | { id: string; role: 'user'; text: string; at: string }
  | {
      id: string
      role: 'assistant'
      at: string
      /** planning → streaming → done, or stopped when the user interrupts. */
      status: 'planning' | 'streaming' | 'done' | 'stopped'
      stages: Stage[]
      stageIndex: number
      /** Characters of `answer.summary` revealed so far. */
      shown: number
      answer: Answer
      /** Question that produced it — powers regenerate. */
      prompt: string
      latencyMs: number
      feedback?: 'up' | 'down'
    }
