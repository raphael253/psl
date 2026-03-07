import type { AssertionType, Verifiability, StatementStatus } from './types'

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-BE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export const ASSERTION_LABELS: Record<AssertionType, string> = {
  fact_claim: 'Affirmation factuelle',
  promise: 'Engagement',
  other: 'Déclaration',
}

export const VERIFIABILITY_LABELS: Record<Verifiability, string> = {
  strong: 'Source primaire officielle',
  medium: 'Média avec citation directe',
  low: 'Source secondaire',
}

export const VERIFIABILITY_COLORS: Record<Verifiability, string> = {
  strong: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  medium: 'bg-amber-100 text-amber-800 border-amber-200',
  low: 'bg-slate-100 text-slate-600 border-slate-200',
}

export const ASSERTION_COLORS: Record<AssertionType, string> = {
  fact_claim: 'bg-blue-100 text-blue-800 border-blue-200',
  promise: 'bg-violet-100 text-violet-800 border-violet-200',
  other: 'bg-slate-100 text-slate-600 border-slate-200',
}

export const STATUS_LABELS: Record<StatementStatus, string> = {
  active: 'Actif',
  corrected: 'Corrigé',
  contested: 'Contesté',
  archived: 'Archivé',
}
